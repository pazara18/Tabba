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

  it("normalizes loop bounds to the available duration", () => {
    expect(
      normalizeLoopRegion(
        { enabled: true, startSeconds: -1, endSeconds: 100 },
        30
      )
    ).toEqual({
      enabled: true,
      startSeconds: 0,
      endSeconds: 30,
    });
  });

  it("disables invalid loops after clamping", () => {
    expect(
      normalizeLoopRegion(
        { enabled: true, startSeconds: 20, endSeconds: 10 },
        20
      )
    ).toEqual({
      enabled: false,
      startSeconds: 20,
      endSeconds: 20,
    });
  });

  it("normalizes playback rate", () => {
    expect(normalizePlaybackRate(0.1)).toBe(0.5);
    expect(normalizePlaybackRate(2)).toBe(1.25);
    expect(normalizePlaybackRate(Number.NaN)).toBe(1);
    expect(normalizePlaybackRate(0.75)).toBe(0.75);
  });
});
