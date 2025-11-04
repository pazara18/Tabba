export interface TimelineMarker {
  time: number;
}

export function createTimelineMarkers(duration: number, markerCount = 5): TimelineMarker[] {
  if (markerCount < 2) {
    throw new Error("Timeline marker count must be at least 2.");
  }

  return Array.from({ length: markerCount }, (_, index) => ({
    time: (duration / (markerCount - 1)) * index,
  }));
}

export function getTimelinePercent(timeSeconds: number, durationSeconds: number): number {
  if (durationSeconds <= 0) {
    return 0;
  }

  return Math.min(100, Math.max(0, (timeSeconds / durationSeconds) * 100));
}

export function formatTimelineMarker(totalSeconds: number): string {
  const safeSeconds = Math.max(0, totalSeconds);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = Math.floor(safeSeconds % 60);

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
