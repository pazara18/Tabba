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
