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
  const duration = options.durationSeconds ?? computeDefaultDuration(track);
  const beats = tempoEstimate
    ? buildBeatGrid(tempoEstimate, duration)
    : buildBeatGrid({ bpm: tempo, beatOffsetSeconds: 0, confidence: 0 }, duration);
  const tuningOffsets = computeTuningOffsets(track.tuning);
  const metadata = options.metadata ?? {};

  const notes = track.events.flatMap((event) => renderNotes(event, track));

  const lines: (string | undefined)[] = [
    `<?xml version="1.0" encoding="utf-8"?>`,
    `<song version="7">`,
    `  <title>${escapeXml(metadata.title ?? track.name)}</title>`,
    `  <arrangement>${track.instrument === "bass" ? "Bass" : "Lead"}</arrangement>`,
    `  <part>1</part>`,
    `  <offset>0.000</offset>`,
    `  <centOffset>0</centOffset>`,
    `  <songLength>${duration.toFixed(3)}</songLength>`,
    `  <startBeat>0.000</startBeat>`,
    `  <averageTempo>${tempo.toFixed(3)}</averageTempo>`,
    `  ${renderTuning(track, tuningOffsets)}`,
    `  <capo>${track.tuning.capoFret ?? 0}</capo>`,
    `  <artistName>${escapeXml(metadata.artistName ?? "Unknown")}</artistName>`,
    `  <albumName>${escapeXml(metadata.albumName ?? "Unknown")}</albumName>`,
    metadata.albumYear !== undefined ? `  <albumYear>${metadata.albumYear}</albumYear>` : undefined,
    `  ${renderEbeats(beats)}`,
    `  <sections count="0"></sections>`,
    `  <events count="0"></events>`,
    `  <levels count="1">`,
    `    <level difficulty="0">`,
    `      ${renderNotesBlock(notes)}`,
    `      <chords count="0"></chords>`,
    `      <anchors count="0"></anchors>`,
    `      <handShapes count="0"></handShapes>`,
    `    </level>`,
    `  </levels>`,
    `</song>`,
  ];

  return lines.filter((line): line is string => line !== undefined).join("\n");
}

function computeDefaultDuration(track: TabTrack): number {
  return track.events.reduce(
    (max, event) => Math.max(max, event.startSeconds + event.durationSeconds),
    0
  );
}

function computeTuningOffsets(tuning: InstrumentTuning): number[] {
  const reference = tuning.instrument === "bass" ? BASS_E_STANDARD_MIDI : GUITAR_E_STANDARD_MIDI;
  const sortedStrings = [...tuning.strings].sort(
    (left, right) => right.stringNumber - left.stringNumber
  );

  return reference.map((referenceMidi, index) => {
    const tuningString = sortedStrings[index];

    if (!tuningString) {
      return 0;
    }

    try {
      return pitchToMidi(tuningString.openPitch) - referenceMidi;
    } catch {
      return 0;
    }
  });
}

function renderTuning(track: TabTrack, offsets: number[]): string {
  const stringCount = track.instrument === "bass" ? 4 : 6;
  const attrs = Array.from({ length: stringCount }, (_, index) => {
    const offset = offsets[index] ?? 0;
    return `string${index}="${offset}"`;
  }).join(" ");

  return `<tuning ${attrs} />`;
}

function renderEbeats(beats: number[]): string {
  if (beats.length === 0) {
    return `<ebeats count="0"></ebeats>`;
  }
