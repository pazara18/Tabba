import { describe, expect, it } from "vitest";
import { formatPlaybackTime } from "./formatPlaybackTime";

describe("formatPlaybackTime", () => {
  it("formats seconds as minutes, seconds, and milliseconds", () => {
    expect(formatPlaybackTime(0)).toBe("0:00.000");
    expect(formatPlaybackTime(1.25)).toBe("0:01.250");
    expect(formatPlaybackTime(61.005)).toBe("1:01.005");
  });

  it("clamps negative display time to zero", () => {
    expect(formatPlaybackTime(-4)).toBe("0:00.000");
  });
});
