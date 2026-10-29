/** Browser-only, page-scoped sprite cache. Never retains more than two bitmaps. */
export type TassoAtlasScene = {
  id: string; ready: boolean; poster: string; frameWidth: number; frameHeight: number;
  fps: number; frameCount: number; columns: number; rows: number; framesPerSheet: number; atlases: string[];
};
type AtlasRequest = {key: string; src: string; width: number; height: number};
type Entry = {bitmap: ImageBitmap; touched: number};

export class TassoAtlasCache {
  private entries = new Map<string, Entry>();
  private queue: AtlasRequest[] = [];
  private wanted = new Set<string>();
  private failed = new Set<string>();
  private current: {request: AtlasRequest; controller: AbortController} | null = null;
  private disposed = false;
  private tick = 0;

  constructor(private readonly invalidate: () => void) {}

  setWanted(keys: string[]) {
    this.wanted = new Set(keys);
    this.queue = this.queue.filter(item => this.wanted.has(item.key));
    if (this.current && !this.wanted.has(this.current.request.key)) this.current.controller.abort();
  }

  get(key: string) {
    const entry = this.entries.get(key);
    if (entry) entry.touched = ++this.tick;
    return entry?.bitmap ?? null;
  }

  hasFailed(key: string) {return this.failed.has(key);}

  ensure(request: AtlasRequest) {
    if (this.disposed || this.entries.has(request.key) || this.failed.has(request.key) || this.current?.request.key === request.key || this.queue.some(item => item.key === request.key)) return;
    this.queue.push(request);
    this.pump();
  }

  private pump() {
    if (this.disposed || this.current) return;
    const request = this.queue.shift();
    if (!request) return;
    if (!this.wanted.has(request.key)) {this.pump(); return;}
    const controller = new AbortController();
    this.current = {request, controller};
    // Fetch/decode is serialized: at most one temporary source decoder exists,
    // and mobile output is resized to 600px per frame before being retained.
    void fetch(request.src, {signal: controller.signal}).then(response => {
      if (!response.ok) throw new Error('Atlas unavailable');
      return response.blob();
    }).then(blob => createImageBitmap(blob, {resizeWidth: request.width, resizeHeight: request.height, resizeQuality: 'high'})).then(bitmap => {
      if (this.disposed || controller.signal.aborted || !this.wanted.has(request.key)) {bitmap.close(); return;}
      while (this.entries.size >= 2) {
        const oldest = Array.from(this.entries.entries()).sort((a, b) => a[1].touched - b[1].touched)[0];
        oldest[1].bitmap.close(); this.entries.delete(oldest[0]);
      }
      this.entries.set(request.key, {bitmap, touched: ++this.tick});
      this.invalidate();
    }).catch(error => {
      if (!this.disposed && !controller.signal.aborted && !(error instanceof DOMException && error.name === 'AbortError')) {this.failed.add(request.key); this.invalidate();}
    }).finally(() => {
      this.current = null;
      this.pump();
    });
  }

  get count() {return this.entries.size;}
  get decodedBytes() {return Array.from(this.entries.values()).reduce((sum, entry) => sum + entry.bitmap.width * entry.bitmap.height * 4, 0);}

  dispose() {
    this.disposed = true; this.current?.controller.abort(); this.queue = [];
    for (const entry of this.entries.values()) entry.bitmap.close();
    this.entries.clear(); this.failed.clear(); this.wanted.clear();
  }
}

const clamp = (n: number) => Math.max(0, Math.min(1, n));
const smooth = (n: number) => {const t = clamp(n); return t * t * (3 - 2 * t);};

export function tassoScrollPose(progress: number) {
  const p = clamp(progress), returning = smooth((p - .33) / .06), dashboard = smooth((p - .64) / .08);
  return {
    progress: p,
    opacity: [1 - returning, returning * (1 - dashboard), dashboard],
    frames: [clamp(p / .33), clamp((p - .39) / .25)],
    step: p < .36 ? 0 : p < .68 ? 1 : 2,
    dashboardScale: .98 + .02 * smooth((p - .72) / .10),
  };
}

export function tassoAtlasRequest(scene: TassoAtlasScene, frame: number, mobile: boolean) {
  const sheet = Math.floor(frame / scene.framesPerSheet), src = scene.atlases[sheet];
  if (!src) return null;
  const frameWidth = Math.min(scene.frameWidth, mobile ? 600 : scene.frameWidth);
  const width = Math.round(frameWidth * scene.columns);
  const height = Math.round(frameWidth * scene.frameHeight / scene.frameWidth * scene.rows);
  return {key: `${src}@${width}x${height}`, src, width, height};
}
