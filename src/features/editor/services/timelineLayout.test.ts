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
