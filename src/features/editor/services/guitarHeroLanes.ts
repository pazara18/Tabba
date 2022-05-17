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
