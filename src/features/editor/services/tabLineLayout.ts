import type { TabEvent } from "../../../domain/tab/types";

export const DEFAULT_TAB_LINE_SECONDS = 8;
export const MIN_TAB_LINE_SECONDS = 1;

export interface TabLine {
  lineIndex: number;
  startSeconds: number;
  endSeconds: number;
  durationSeconds: number;
}

export function createTabLines(
  totalDurationSeconds: number,
  lineDurationSeconds: number = DEFAULT_TAB_LINE_SECONDS
): TabLine[] {
  if (lineDurationSeconds < MIN_TAB_LINE_SECONDS) {
    throw new Error(
      `Tab line duration must be at least ${MIN_TAB_LINE_SECONDS} second.`
    );
