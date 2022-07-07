export interface LoopRegion {
  enabled: boolean;
  endSeconds: number;
  startSeconds: number;
}

export const playbackRates = [0.5, 0.75, 1, 1.25] as const;

export function createDefaultLoopRegion(durationSeconds: number): LoopRegion {
  const endSeconds = Math.min(Math.max(durationSeconds, 1), 10);

  return {
    enabled: false,
    startSeconds: 0,
    endSeconds,
  };
}

export function normalizeLoopRegion(
  region: LoopRegion,
  durationSeconds: number
): LoopRegion {
  const safeDuration = Math.max(0, durationSeconds);
  const startSeconds = clamp(region.startSeconds, 0, safeDuration);
  const minimumEnd = Math.min(safeDuration, startSeconds + 0.05);
  const endSeconds = clamp(region.endSeconds, minimumEnd, safeDuration);

  return {
    enabled: region.enabled && endSeconds > startSeconds,
    startSeconds,
    endSeconds,
  };
}

export function normalizePlaybackRate(rate: number): number {
