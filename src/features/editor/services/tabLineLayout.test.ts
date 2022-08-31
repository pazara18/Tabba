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
    candidates: [],
    confidence: 1,
    locked: false,
  };
}

describe("createTabLines", () => {
  it("creates one line per chunk of the total duration", () => {
    const lines = createTabLines(20, 8);

    expect(lines).toHaveLength(3);
    expect(lines[0]).toMatchObject({ startSeconds: 0, endSeconds: 8 });
    expect(lines[1]).toMatchObject({ startSeconds: 8, endSeconds: 16 });
    expect(lines[2]).toMatchObject({ startSeconds: 16, endSeconds: 20 });
  });

  it("produces a single empty line when total duration is zero", () => {
    const lines = createTabLines(0, 8);
    expect(lines).toHaveLength(1);
    expect(lines[0].startSeconds).toBe(0);
  });

  it("throws when line duration is below the minimum", () => {
    expect(() => createTabLines(20, 0.5)).toThrow();
  });
});

describe("getActiveLineIndex", () => {
  const lines = createTabLines(20, 8);

  it("returns the line that contains the current time", () => {
    expect(getActiveLineIndex(0, lines)).toBe(0);
    expect(getActiveLineIndex(7.99, lines)).toBe(0);
    expect(getActiveLineIndex(8, lines)).toBe(1);
    expect(getActiveLineIndex(16, lines)).toBe(2);
    expect(getActiveLineIndex(19.5, lines)).toBe(2);
  });

  it("returns the last line when current time exceeds total duration", () => {
    expect(getActiveLineIndex(999, lines)).toBe(2);
  });
