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

