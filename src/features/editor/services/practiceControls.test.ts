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
