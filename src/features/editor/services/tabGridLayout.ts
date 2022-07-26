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
