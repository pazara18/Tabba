import { describe, expect, it } from "vitest";
import {
  computeStemGain,
  dropStemMix,
  getStemMix,
  isAnyStemSoloed,
  toggleStemMute,
  toggleStemSolo,
  type StemMix,
} from "./stemMixState";

const muted: StemMix = { muted: true, solo: false };
const solo: StemMix = { muted: false, solo: true };
const normal: StemMix = { muted: false, solo: false };

describe("computeStemGain", () => {
  it("plays normal stems at unit gain", () => {
    expect(computeStemGain(normal, false)).toBe(1);
  });

  it("silences muted stems", () => {
    expect(computeStemGain(muted, false)).toBe(0);
  });

  it("plays only soloed stems when any stem is soloed", () => {
    expect(computeStemGain(solo, true)).toBe(1);
    expect(computeStemGain(normal, true)).toBe(0);
    expect(computeStemGain(muted, true)).toBe(0);
  });
});

describe("isAnyStemSoloed", () => {
  it("detects a soloed stem in the mix map", () => {
    expect(isAnyStemSoloed({})).toBe(false);
    expect(isAnyStemSoloed({ a: normal, b: muted })).toBe(false);
    expect(isAnyStemSoloed({ a: normal, b: solo })).toBe(true);
  });
});

describe("toggleStemMute / toggleStemSolo", () => {
  it("toggles mute state immutably", () => {
    const next = toggleStemMute({}, "a");
    expect(next.a).toEqual({ muted: true, solo: false });

    const after = toggleStemMute(next, "a");
    expect(after.a).toEqual({ muted: false, solo: false });
  });

  it("toggles solo state immutably", () => {
    const next = toggleStemSolo({ a: muted }, "a");
    expect(next.a).toEqual({ muted: true, solo: true });
  });
});

