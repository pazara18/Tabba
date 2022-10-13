import type { TabEvent, TabPosition } from "../../../domain/tab/types";
import type { TabTrack } from "../../project/types";
import {
  createTabLines,
  DEFAULT_TAB_LINE_SECONDS,
  getEventsForLine,
  type TabLine,
} from "./tabLineLayout";

const DEFAULT_COLUMNS_PER_LINE = 64;
const MIN_COLUMNS_PER_LINE = 16;

export interface TrackToAsciiTabOptions {
  lineDurationSeconds?: number;
  columnsPerLine?: number;
}

export function trackToAsciiTab(
  track: TabTrack,
  totalDurationSeconds: number,
  options: TrackToAsciiTabOptions = {}
): string {
  const lineDurationSeconds = options.lineDurationSeconds ?? DEFAULT_TAB_LINE_SECONDS;
  const columnsPerLine = Math.max(
    MIN_COLUMNS_PER_LINE,
    options.columnsPerLine ?? DEFAULT_COLUMNS_PER_LINE
  );
