export function formatPlaybackTime(totalSeconds: number): string {
  const safeSeconds = Math.max(0, totalSeconds);
