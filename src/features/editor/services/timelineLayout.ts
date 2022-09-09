export interface TimelineMarker {
  time: number;
}

export function createTimelineMarkers(duration: number, markerCount = 5): TimelineMarker[] {
  if (markerCount < 2) {
    throw new Error("Timeline marker count must be at least 2.");
  }

  return Array.from({ length: markerCount }, (_, index) => ({
