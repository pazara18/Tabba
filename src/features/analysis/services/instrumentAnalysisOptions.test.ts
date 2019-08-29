import { describe, expect, it } from "vitest";
import { getInstrumentPitchOptions } from "./instrumentAnalysisOptions";

describe("instrumentAnalysisOptions", () => {
  it("uses a lower and steadier pitch range for bass", () => {
    expect(getInstrumentPitchOptions("bass")).toMatchObject({
      frameSize: 4096,
      maxFrequencyHz: 450,
      minFrequencyHz: 38,
      pitchWobbleSemitones: 2,
    });
  });
