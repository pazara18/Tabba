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

