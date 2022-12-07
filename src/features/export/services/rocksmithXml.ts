import { pitchToMidi } from "../../../domain/pitch/pitchNames";
import type { InstrumentTuning } from "../../../domain/instruments/types";
import type { TabEvent, TabPosition } from "../../../domain/tab/types";
import type { TabTrack } from "../../project/types";
import {
  buildBeatGrid,
  estimateTempoFromOnsets,
} from "../../analysis/services/tempoInference";

export interface RocksmithMetadata {
  albumName?: string;
  albumYear?: number;
  artistName?: string;
  title?: string;
}

