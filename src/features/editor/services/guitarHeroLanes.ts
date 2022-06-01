import { pitchToMidi } from "../../../domain/pitch/pitchNames";
import type { TabEvent } from "../../../domain/tab/types";

export const GH_LANE_COUNT = 5;

export interface GhNote {
  id: string;
  eventId: string;
  lane: number;
  startSeconds: number;
  sustainSeconds: number;
  isChord: boolean;
}

export interface GhTrack {
  notes: GhNote[];
  laneCount: number;
  pitchRange: { min: number; max: number } | undefined;
}

export const GH_LANE_NAMES = ["Green", "Red", "Yellow", "Blue", "Orange"] as const;

export function eventsToGhTrack(events: TabEvent[]): GhTrack {
  const midiList = collectMidiPitches(events);

  if (midiList.length === 0) {
    return { notes: [], laneCount: GH_LANE_COUNT, pitchRange: undefined };
  }

  const min = Math.min(...midiList);
  const max = Math.max(...midiList);
  const notes: GhNote[] = [];

  for (const event of events) {
    const isChord = event.chosenPositions.length > 1;
    const lanesUsed = new Set<number>();

    for (const position of event.chosenPositions) {
      const midi = safePitchToMidi(position.pitch);

      if (midi === undefined) {
        continue;
      }

      const lane = bucketMidiToLane(midi, min, max);

      if (lanesUsed.has(lane)) {
        continue;
      }

      lanesUsed.add(lane);
      notes.push({
        id: `${event.id}-${lane}`,
        eventId: event.id,
        lane,
        startSeconds: event.startSeconds,
        sustainSeconds: event.durationSeconds,
        isChord,
      });
    }
  }

  notes.sort((a, b) => a.startSeconds - b.startSeconds || a.lane - b.lane);

  return {
    notes,
    laneCount: GH_LANE_COUNT,
    pitchRange: { min, max },
  };
}

export function bucketMidiToLane(midi: number, min: number, max: number): number {
  if (max <= min) {
    return Math.floor(GH_LANE_COUNT / 2);
  }

  const ratio = (midi - min) / (max - min);
  const raw = Math.floor(ratio * GH_LANE_COUNT);

  return Math.min(GH_LANE_COUNT - 1, Math.max(0, raw));
}

function collectMidiPitches(events: TabEvent[]): number[] {
  const midi: number[] = [];

  for (const event of events) {
    for (const position of event.chosenPositions) {
