import { describe, expect, it } from "vitest";
import type { TabEvent } from "../../../domain/tab/types";
import {
  createTabGridCells,
  getTabEventsForString,
  getTabGridCellOffsetPercent,
  getTabGridCellStartSeconds,
  getTabGridColumnCount,
  getTabGridColumnIndex,
  MAX_TAB_GRID_COLUMNS,
  MIN_TAB_GRID_COLUMNS,
} from "./tabGridLayout";

describe("tabGridLayout", () => {
  it("chooses a bounded column count from the duration", () => {
    expect(getTabGridColumnCount(4)).toBe(MIN_TAB_GRID_COLUMNS);
    expect(getTabGridColumnCount(60)).toBe(480);
    expect(getTabGridColumnCount(600)).toBe(MAX_TAB_GRID_COLUMNS);
  });

  it("creates cells with start and end times", () => {
    expect(createTabGridCells(8, 4)).toEqual([
      { columnIndex: 0, startSeconds: 0, endSeconds: 2 },
      { columnIndex: 1, startSeconds: 2, endSeconds: 4 },
      { columnIndex: 2, startSeconds: 4, endSeconds: 6 },
      { columnIndex: 3, startSeconds: 6, endSeconds: 8 },
    ]);
  });

  it("converts a cell index back into a start time", () => {
    expect(getTabGridCellStartSeconds(2, 8, 4)).toBe(4);
    expect(getTabGridCellStartSeconds(-1, 8, 4)).toBe(0);
    expect(getTabGridCellStartSeconds(10, 8, 4)).toBe(8);
  });

  it("maps time into clamped zero-based cell indexes", () => {
    expect(getTabGridColumnIndex(0, 8, 4)).toBe(0);
    expect(getTabGridColumnIndex(1.99, 8, 4)).toBe(0);
    expect(getTabGridColumnIndex(2, 8, 4)).toBe(1);
    expect(getTabGridColumnIndex(8, 8, 4)).toBe(3);
    expect(getTabGridColumnIndex(-1, 8, 4)).toBe(0);
    expect(getTabGridColumnIndex(12, 8, 4)).toBe(3);
    expect(getTabGridColumnIndex(2, 0, 4)).toBe(0);
  });

