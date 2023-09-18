import type { InstrumentTuning } from "../instruments/types";
import { midiToPitch, pitchToMidi } from "../pitch/pitchNames";
import type { CandidateInterpretation, TabPosition } from "../tab/types";

interface FingeringOptions {
  maxFret?: number;
  previousPosition?: TabPosition;
}

const defaultMaxFret = 24;

export function generatePitchPositions(
  pitch: string,
  tuning: InstrumentTuning,
  options: FingeringOptions = {}
): TabPosition[] {
  const targetMidi = pitchToMidi(pitch);
  const maxFret = options.maxFret ?? defaultMaxFret;

  return tuning.strings.flatMap((string) => {
    const fret = targetMidi - pitchToMidi(string.openPitch);

    if (fret < 0 || fret > maxFret) {
      return [];
    }

    return [
      {
        stringNumber: string.stringNumber,
        fret,
        pitch: midiToPitch(targetMidi),
      },
    ];
  });
}

export function createPositionCandidates(
  pitch: string,
  tuning: InstrumentTuning,
  options: FingeringOptions = {}
): CandidateInterpretation[] {
  return generatePitchPositions(pitch, tuning, options)
    .map((position) => ({
      id: `single:${position.stringNumber}:${position.fret}`,
      kind: "single" as const,
      label: `String ${position.stringNumber}, fret ${position.fret}`,
      positions: [position],
      confidence: 1,
