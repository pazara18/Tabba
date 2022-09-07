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
