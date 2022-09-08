import { describe, expect, it } from "vitest";
import {
  createTimelineMarkers,
  formatTimelineMarker,
  getTimelinePercent,
} from "./timelineLayout";

describe("timelineLayout", () => {
  it("creates evenly spaced markers", () => {
    expect(createTimelineMarkers(60)).toEqual([
      { time: 0 },
      { time: 15 },
      { time: 30 },
      { time: 45 },
      { time: 60 },
    ]);
  });

  it("requires at least two markers", () => {
    expect(() => createTimelineMarkers(60, 1)).toThrow(
      "Timeline marker count must be at least 2."
    );
  });

  it("converts time into clamped percentages", () => {
    expect(getTimelinePercent(30, 60)).toBe(50);
    expect(getTimelinePercent(-5, 60)).toBe(0);
    expect(getTimelinePercent(70, 60)).toBe(100);
