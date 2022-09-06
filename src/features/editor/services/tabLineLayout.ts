import type { TabEvent } from "../../../domain/tab/types";

export const DEFAULT_TAB_LINE_SECONDS = 8;
export const MIN_TAB_LINE_SECONDS = 1;

export interface TabLine {
  lineIndex: number;
  startSeconds: number;
