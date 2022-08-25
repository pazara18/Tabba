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
}

export function createTabGridCells(
  durationSeconds: number,
  columnCount = getTabGridColumnCount(durationSeconds)
): TabGridCell[] {
  assertPositiveColumnCount(columnCount);

  return Array.from({ length: columnCount }, (_, columnIndex) => ({
    columnIndex,
    startSeconds: getTabGridCellStartSeconds(columnIndex, durationSeconds, columnCount),
    endSeconds: getTabGridCellStartSeconds(columnIndex + 1, durationSeconds, columnCount),
  }));
}

export function getTabGridCellStartSeconds(
  columnIndex: number,
  durationSeconds: number,
  columnCount: number
): number {
  assertPositiveColumnCount(columnCount);

  const clampedColumn = Math.min(columnCount, Math.max(0, columnIndex));
  const safeDuration = Math.max(0, durationSeconds);

  return (safeDuration / columnCount) * clampedColumn;
}

export function getTabGridColumnIndex(
  timeSeconds: number,
  durationSeconds: number,
  columnCount: number
): number {
  assertPositiveColumnCount(columnCount);

  if (durationSeconds <= 0) {
    return 0;
  }

  const clampedTime = Math.min(durationSeconds, Math.max(0, timeSeconds));

  if (clampedTime === durationSeconds) {
    return columnCount - 1;
  }

  return Math.floor((clampedTime / durationSeconds) * columnCount);
}

export function getTabGridCellOffsetPercent(
  timeSeconds: number,
  durationSeconds: number,
  columnCount: number
): number {
  assertPositiveColumnCount(columnCount);

  if (durationSeconds <= 0) {
    return 0;
  }

  const columnIndex = getTabGridColumnIndex(timeSeconds, durationSeconds, columnCount);
  const cellStartSeconds = getTabGridCellStartSeconds(
    columnIndex,
    durationSeconds,
    columnCount
  );
  const cellEndSeconds = getTabGridCellStartSeconds(
    columnIndex + 1,
    durationSeconds,
    columnCount
  );
  const cellDuration = cellEndSeconds - cellStartSeconds;

  if (cellDuration <= 0) {
    return 0;
  }

  const clampedTime = Math.min(durationSeconds, Math.max(0, timeSeconds));

  return Math.min(99, Math.max(0, ((clampedTime - cellStartSeconds) / cellDuration) * 100));
}

export function getTabEventsForString(
