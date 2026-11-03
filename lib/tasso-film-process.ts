export const TASSO_FILM_START = 280;
export const TASSO_FILM_END = 465;
export const TASSO_FILM_JUMPS = [.16, .51, .72] as const;

export type TassoFilmVariant = {
  frameWidth: number;
  frameHeight: number;
  columns: number;
  rows: number;
  framesPerSheet: number;
  atlases: string[];
  poster: string;
  chapterPosters?: string[];
};

export type TassoFilmManifest = {
  id: string;
  fps: number;
  frameCount: number;
  variants: {desktop: TassoFilmVariant; mobile: TassoFilmVariant};
  chapters: {
    id: string;
    startFrame: number;
    endFrameExclusive: number;
    posterFrame: number;
    poster: string;
    mobilePoster?: string;
    posterWidth: number;
    posterHeight: number;
  }[];
};

export type TassoFilmPose = {
  progress: number;
  sourceFrame: number;
  step: number;
  copyOpacity: number;
  copyY: number;
};

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => {const p = clamp(value); return p * p * (3 - 2 * p);};
const sourceKeys = [[0, 0], [.05, 5], [.30, 113], [.35, 156], [.67, 348], [.73, 384], [.95, 647], [1, 647]] as const;

/** One authored source clock. Reversing scroll visits the same physical frames. */
export function tassoFilmPose(frame: number, frameCount = 648): TassoFilmPose {
  const safe = Number.isFinite(frame) ? frame : TASSO_FILM_START;
  const progress = clamp((safe - TASSO_FILM_START) / (TASSO_FILM_END - TASSO_FILM_START));
  let source = 0;
  for (let i = 1; i < sourceKeys.length; i++) {
    if (progress <= sourceKeys[i][0]) {
      const [from, first] = sourceKeys[i - 1], [to, last] = sourceKeys[i];
      source = first + (last - first) * clamp((progress - from) / (to - from));
      break;
    }
  }
  const sourceFrame = Math.max(0, Math.min(frameCount - 1, Math.floor(source * (frameCount - 1) / 647 + 1e-7)));
  const firstBoundary = Math.floor(156 * (frameCount - 1) / 647 + 1e-7);
  const secondBoundary = Math.floor(348 * (frameCount - 1) / 647 + 1e-7);
  const step = sourceFrame < firstBoundary ? 0 : sourceFrame < secondBoundary ? 1 : 2;
  const entry = step === 0 ? 1 : smooth((progress - (step === 1 ? .35 : .67)) / .026);
  const departure = step === 2 ? 0 : smooth((progress - (step === 0 ? .324 : .644)) / .026);
  return {progress, sourceFrame, step, copyOpacity: entry * (1 - departure), copyY: 8 * (1 - entry) - 8 * departure};
}

export type TassoFilmAtlasRequest = {key: string; src: string; width: number; height: number};
export type TassoFilmDecodedAtlas = {source: CanvasImageSource; width: number; height: number; close: () => void};
type Entry = TassoFilmDecodedAtlas & {touched: number};

export function tassoFilmAtlasRequest(variant: TassoFilmVariant, sourceFrame: number): TassoFilmAtlasRequest | null {
  const sheet = Math.floor(Math.max(0, sourceFrame) / variant.framesPerSheet);
  const src = variant.atlases[sheet];
  return src ? {key: src, src, width: variant.frameWidth * variant.columns, height: variant.frameHeight * variant.rows} : null;
}

async function decodeAtlas(blob: Blob, signal: AbortSignal): Promise<TassoFilmDecodedAtlas> {
  if (typeof createImageBitmap === 'function') {
    try {
      // Separate native-size mobile assets avoid unsupported resize options and
      // avoid fetching a desktop atlas merely to shrink its decoder output.
      const bitmap = await createImageBitmap(blob);
      return {source: bitmap, width: bitmap.width, height: bitmap.height, close: () => bitmap.close()};
    } catch (error) {
      if (signal.aborted) throw error;
    }
  }
  const src = URL.createObjectURL(blob), image = new Image();
  image.decoding = 'async';
  try {
    await new Promise<void>((resolve, reject) => {
      const clear = () => {image.onload = null; image.onerror = null; signal.removeEventListener('abort', abort);};
      const abort = () => {clear(); image.removeAttribute('src'); reject(new DOMException('Atlas cancelled', 'AbortError'));};
      image.onload = () => {clear(); resolve();};
      image.onerror = () => {clear(); reject(new Error('Atlas could not be decoded'));};
      signal.addEventListener('abort', abort, {once: true});
      if (signal.aborted) {abort(); return;}
      image.src = src;
    });
    return {source: image, width: image.naturalWidth, height: image.naturalHeight, close: () => image.removeAttribute('src')};
  } finally {URL.revokeObjectURL(src);}
}

/** A single serial decoder, two retained atlases, and no animation clock. */
export class TassoFilmAtlasCache {
  private entries = new Map<string, Entry>();
  private queue: TassoFilmAtlasRequest[] = [];
  private wanted = new Set<string>();
  private failures = new Map<string, number>();
  private pending: {request: TassoFilmAtlasRequest; controller: AbortController} | null = null;
  private disposed = false;
  private tick = 0;

  constructor(private readonly invalidate: () => void) {}

  setWanted(keys: string[]) {
    this.wanted = new Set(keys.slice(0, 2));
    this.queue = this.queue.filter(request => this.wanted.has(request.key));
    if (this.pending && !this.wanted.has(this.pending.request.key)) this.pending.controller.abort();
  }

  get(key: string) {
    const entry = this.entries.get(key);
    if (entry) entry.touched = ++this.tick;
    return entry ?? null;
  }

  hasFailed(key: string) {return this.failures.has(key);}
  resetFailures() {this.failures.clear();}

  ensure(request: TassoFilmAtlasRequest) {
    const failedAt = this.failures.get(request.key);
    if (this.disposed || this.entries.has(request.key) || !this.wanted.has(request.key) || this.pending?.request.key === request.key || this.queue.some(item => item.key === request.key) || (failedAt !== undefined && Date.now() - failedAt < 1800)) return;
    this.failures.delete(request.key);
    this.queue.push(request);
    this.pump();
  }

  private pump() {
    if (this.disposed || this.pending) return;
    const request = this.queue.shift();
    if (!request) return;
    if (!this.wanted.has(request.key)) {this.pump(); return;}
    while (this.entries.size >= 2) {
      const oldest = Array.from(this.entries.entries()).sort((a, b) => a[1].touched - b[1].touched)[0];
      oldest[1].close(); this.entries.delete(oldest[0]);
    }
    const controller = new AbortController();
    this.pending = {request, controller};
    void fetch(request.src, {signal: controller.signal}).then(response => {
      if (!response.ok) throw new Error('Film frame unavailable');
      return response.blob();
    }).then(blob => decodeAtlas(blob, controller.signal)).then(decoded => {
      if (this.disposed || controller.signal.aborted || !this.wanted.has(request.key)) {decoded.close(); return;}
      if (decoded.width !== request.width || decoded.height !== request.height) {decoded.close(); throw new Error('Unexpected film atlas dimensions');}
      this.entries.set(request.key, {...decoded, touched: ++this.tick});
      this.invalidate();
    }).catch(error => {
      if (!this.disposed && !controller.signal.aborted && !(error instanceof DOMException && error.name === 'AbortError')) {this.failures.set(request.key, Date.now()); this.invalidate();}
    }).finally(() => {this.pending = null; this.pump();});
  }

  get count() {return this.entries.size;}
  get decodedBytes() {return Array.from(this.entries.values()).reduce((sum, item) => sum + item.width * item.height * 4, 0);}
  get inFlight() {return this.pending !== null;}

  dispose() {
    this.disposed = true; this.pending?.controller.abort(); this.queue = [];
    for (const entry of this.entries.values()) entry.close();
    this.entries.clear(); this.failures.clear(); this.wanted.clear();
  }
}
