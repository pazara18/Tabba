import { createPositionCandidates } from "../../../domain/fingering/fretboardCandidates";
import type { InstrumentTuning } from "../../../domain/instruments/types";
import type { TabEvent, TabPosition } from "../../../domain/tab/types";
import type { DetectedNote } from "../types";

interface SuggestedEventOptions {
  createId?: () => string;
