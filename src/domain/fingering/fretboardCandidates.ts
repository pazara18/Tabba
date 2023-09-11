import type { InstrumentTuning } from "../instruments/types";
import { midiToPitch, pitchToMidi } from "../pitch/pitchNames";
import type { CandidateInterpretation, TabPosition } from "../tab/types";

interface FingeringOptions {
  maxFret?: number;
