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

export interface RocksmithXmlOptions {
  averageTempo?: number;
  durationSeconds?: number;
  metadata?: RocksmithMetadata;
}

const GUITAR_E_STANDARD_MIDI = [40, 45, 50, 55, 59, 64]; // string0..string5
const BASS_E_STANDARD_MIDI = [28, 33, 38, 43]; // string0..string3
const DEFAULT_TEMPO = 120;

export function trackToRocksmithXml(
  track: TabTrack,
  options: RocksmithXmlOptions = {}
): string {
  const onsets = track.events.map((event) => event.startSeconds);
  const tempoEstimate = estimateTempoFromOnsets(onsets);
  const tempo = options.averageTempo ?? tempoEstimate?.bpm ?? DEFAULT_TEMPO;
