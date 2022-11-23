import type { TabTrack } from "../../project/types";
import {
  eventsToGhTrack,
  GH_LANE_COUNT,
  type GhNote,
} from "../../editor/services/guitarHeroLanes";
import { estimateTempoFromOnsets } from "../../analysis/services/tempoInference";

export interface CloneHeroChartMetadata {
  artist?: string;
  charter?: string;
  musicStream?: string;
  name?: string;
}

export interface CloneHeroChartOptions {
  bpm?: number;
  difficulty?: "ExpertSingle" | "HardSingle" | "MediumSingle" | "EasySingle";
  metadata?: CloneHeroChartMetadata;
  resolution?: number;
}

const DEFAULT_RESOLUTION = 192;
const DEFAULT_BPM = 120;
const DEFAULT_DIFFICULTY = "ExpertSingle";

export function trackToCloneHeroChart(
  track: TabTrack,
  options: CloneHeroChartOptions = {}
): string {
  const resolution = options.resolution ?? DEFAULT_RESOLUTION;
  const bpm = options.bpm ?? inferBpmForTrack(track);
  const difficulty = options.difficulty ?? DEFAULT_DIFFICULTY;
  const ghTrack = eventsToGhTrack(track.events);

  const lines = [
    renderSongSection(track, bpm, resolution, options.metadata ?? {}),
    renderSyncSection(bpm),
    renderEventsSection(),
    renderNotesSection(difficulty, ghTrack.notes, bpm, resolution),
  ];

  return lines.join("\n");
}

export function inferBpmForTrack(track: TabTrack): number {
  const onsets = track.events.map((event) => event.startSeconds);
  const estimate = estimateTempoFromOnsets(onsets);

  return estimate?.bpm ?? DEFAULT_BPM;
}

function renderSongSection(
  track: TabTrack,
  bpm: number,
  resolution: number,
  metadata: CloneHeroChartMetadata
): string {
  const fields: [string, string][] = [
    ["Name", quote(metadata.name ?? track.name)],
    ["Artist", quote(metadata.artist ?? "Tabba")],
    ["Charter", quote(metadata.charter ?? "Tabba")],
    ["Offset", "0"],
    ["Resolution", String(resolution)],
    ["Player2", track.instrument === "bass" ? "bass" : "rhythm"],
    ["Difficulty", "0"],
    ["PreviewStart", "0"],
    ["PreviewEnd", "0"],
    ["Genre", quote("Rock")],
    ["MediaType", quote("cd")],
    ["MusicStream", quote(metadata.musicStream ?? "song.ogg")],
    ["BPM", bpm.toFixed(3)],
  ];

  const body = fields.map(([key, value]) => `  ${key} = ${value}`).join("\n");

  return `[Song]\n{\n${body}\n}`;
}

function renderSyncSection(bpm: number): string {
  const bpmMilli = Math.round(bpm * 1000);

  return `[SyncTrack]\n{\n  0 = TS 4\n  0 = B ${bpmMilli}\n}`;
}

function renderEventsSection(): string {
  return `[Events]\n{\n}`;
}

function renderNotesSection(
  difficulty: string,
  notes: GhNote[],
  bpm: number,
  resolution: number
): string {
  const ticksByPosition = new Map<number, string[]>();

  for (const note of notes) {
    const tick = secondsToTicks(note.startSeconds, bpm, resolution);
    const length = Math.max(0, secondsToTicks(note.sustainSeconds, bpm, resolution));

