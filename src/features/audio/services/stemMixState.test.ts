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
