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
