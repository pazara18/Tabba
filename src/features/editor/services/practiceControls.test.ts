import { describe, expect, it } from "vitest";
import {
  createDefaultLoopRegion,
  normalizeLoopRegion,
  normalizePlaybackRate,
} from "./practiceControls";

describe("practiceControls", () => {
  it("creates a short default loop for a track duration", () => {
    expect(createDefaultLoopRegion(60)).toEqual({
      enabled: false,
      startSeconds: 0,
      endSeconds: 10,
    });
  });

  it("keeps short default loops inside short durations", () => {
    expect(createDefaultLoopRegion(4).endSeconds).toBe(4);
    expect(createDefaultLoopRegion(0).endSeconds).toBe(1);
  });
