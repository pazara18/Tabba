export interface TimelineMarker {
  time: number;
}

export function createTimelineMarkers(duration: number, markerCount = 5): TimelineMarker[] {
  if (markerCount < 2) {
