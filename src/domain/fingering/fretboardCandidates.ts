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
      score: scorePosition(position, options.previousPosition),
    }))
    .sort((left, right) => (left.score ?? 0) - (right.score ?? 0));
}

export function scorePosition(position: TabPosition, previousPosition?: TabPosition): number {
  const openStringAdjustment = position.fret === 0 ? -0.25 : 0;
  const highFretPenalty = position.fret > 12 ? (position.fret - 12) * 0.2 : 0;

  if (!previousPosition) {
    return position.fret + highFretPenalty + openStringAdjustment;
  }

  return (
    Math.abs(position.fret - previousPosition.fret) +
    Math.abs(position.stringNumber - previousPosition.stringNumber) * 0.75 +
    highFretPenalty +
    openStringAdjustment
  );
}
