import { createPositionCandidates } from "../../../domain/fingering/fretboardCandidates";
import { transposePitch } from "../../../domain/pitch/pitchNames";
import type { InstrumentTuning } from "../../../domain/instruments/types";
import type { TabEvent } from "../../../domain/tab/types";

interface CreateManualTabEventOptions {
  createId?: () => string;
  durationSeconds?: number;
  fret: number;
  startSeconds: number;
  stringNumber: number;
  tuning: InstrumentTuning;
}

const defaultCreateId = () => crypto.randomUUID();

export function createManualTabPosition(
  tuning: InstrumentTuning,
  stringNumber: number,
  fret: number
) {
  if (fret < 0 || !Number.isInteger(fret)) {
    throw new Error("Fret must be a non-negative integer.");
  }

  const string = tuning.strings.find((candidate) => candidate.stringNumber === stringNumber);

  if (!string) {
    throw new Error(`String ${stringNumber} does not exist in ${tuning.name}.`);
  }

  return {
    stringNumber,
    fret,
    pitch: transposePitch(string.openPitch, fret),
  };
}

export function createManualTabEvent({
  createId = defaultCreateId,
