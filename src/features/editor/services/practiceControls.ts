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
