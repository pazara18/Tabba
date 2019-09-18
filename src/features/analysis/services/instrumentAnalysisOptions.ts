import type { InstrumentKind } from "../../../domain/instruments/types";
import type { PitchDetectionOptions } from "./pitchDetection";

export function getInstrumentPitchOptions(instrument: InstrumentKind): PitchDetectionOptions {
  if (instrument === "bass") {
    return {
      frameSize: 4096,
      hopSize: 1024,
      maxFrequencyHz: 450,
      minDurationSeconds: 0.12,
      minFrequencyHz: 38,
      pitchWobbleMergeSeconds: 0.28,
      pitchWobbleSemitones: 2,
      rmsThreshold: 0.012,
    };
  }
