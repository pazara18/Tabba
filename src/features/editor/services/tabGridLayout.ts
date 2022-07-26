import type { TabEvent, TabPosition } from "../../../domain/tab/types";

export const DEFAULT_TAB_CELL_SECONDS = 0.125;
export const MAX_TAB_GRID_COLUMNS = 1440;
export const MIN_TAB_GRID_COLUMNS = 64;

export interface TabGridCell {
  columnIndex: number;
  endSeconds: number;
  startSeconds: number;
}

export interface PositionedTabGridEvent {
  cellOffsetPercent: number;
  columnIndex: number;
  event: TabEvent;
  position: TabPosition;
}

export function getTabGridColumnCount(
  durationSeconds: number,
  cellSeconds = DEFAULT_TAB_CELL_SECONDS
): number {
  if (cellSeconds <= 0) {
    throw new Error("Tab grid cell seconds must be greater than zero.");
  }

  const estimatedColumns = Math.ceil(Math.max(0, durationSeconds) / cellSeconds);

  return Math.min(MAX_TAB_GRID_COLUMNS, Math.max(MIN_TAB_GRID_COLUMNS, estimatedColumns));
