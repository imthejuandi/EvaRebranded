const END = 980;
const PRODUCT_START = 280;
const PRODUCT_END = 465;
const PRODUCT_WEIGHT = 1;
const WEIGHTED_PRODUCT_END = PRODUCT_START + (PRODUCT_END - PRODUCT_START) * PRODUCT_WEIGHT;
const WEIGHTED_END = END + (PRODUCT_END - PRODUCT_START) * (PRODUCT_WEIGHT - 1);

const clamp = (value: number, maximum: number) => Math.max(0, Math.min(maximum, Number.isFinite(value) ? value : 0));

/** The film plays in real time; no extra scroll distance is needed to scrub it. */
export const STORY_SCROLL_HEIGHT_SVH = 100 + 820 * WEIGHTED_END / END;

export function storyFrameAtProgress(progress: number): number {
  const position = clamp(progress, 1) * WEIGHTED_END;
  if (position <= PRODUCT_START) return position;
  if (position <= WEIGHTED_PRODUCT_END) return PRODUCT_START + (position - PRODUCT_START) / PRODUCT_WEIGHT;
  return PRODUCT_END + position - WEIGHTED_PRODUCT_END;
}

/** Also used by chapter jumps and compositor keyframes, so every clock agrees. */
export function storyProgressAtFrame(frame: number): number {
  const bounded = clamp(frame, END);
  const position = bounded <= PRODUCT_START ? bounded
    : bounded <= PRODUCT_END ? PRODUCT_START + (bounded - PRODUCT_START) * PRODUCT_WEIGHT
    : WEIGHTED_PRODUCT_END + bounded - PRODUCT_END;
  return position / WEIGHTED_END;
}
