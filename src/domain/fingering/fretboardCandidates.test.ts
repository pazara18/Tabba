import { describe, expect, it } from "vitest";
import { standardBassTuning, standardGuitarTuning } from "../instruments/standardTunings";
import { createPositionCandidates, generatePitchPositions, scorePosition } from "./fretboardCandidates";

describe("fretboardCandidates", () => {
  it("generates all guitar positions for a pitch", () => {
    expect(generatePitchPositions("E3", standardGuitarTuning)).toEqual([
      { stringNumber: 4, fret: 2, pitch: "E3" },
      { stringNumber: 5, fret: 7, pitch: "E3" },
      { stringNumber: 6, fret: 12, pitch: "E3" },
    ]);
  });

  it("respects maximum fret limits", () => {
    expect(generatePitchPositions("E3", standardGuitarTuning, { maxFret: 5 })).toEqual([
      { stringNumber: 4, fret: 2, pitch: "E3" },
    ]);
  });

  it("returns no positions for pitches outside the instrument range", () => {
    expect(generatePitchPositions("C1", standardGuitarTuning)).toEqual([]);
  });

  it("creates sorted candidate interpretations", () => {
