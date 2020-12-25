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
