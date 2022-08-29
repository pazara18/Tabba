import { describe, expect, it } from "vitest";
import type { TabEvent } from "../../../domain/tab/types";
import {
  createTabLines,
  getActiveLineIndex,
  getEventsForLine,
  getLineRelativePercent,
} from "./tabLineLayout";

function makeEvent(id: string, startSeconds: number): TabEvent {
  return {
    id,
    startSeconds,
    durationSeconds: 0.25,
    kind: "single",
    texture: "mono",
    detectedPitches: [],
    chosenPositions: [],
