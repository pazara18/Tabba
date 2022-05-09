import { pitchToMidi } from "../../../domain/pitch/pitchNames";
import type { TabEvent } from "../../../domain/tab/types";

export const GH_LANE_COUNT = 5;

export interface GhNote {
  id: string;
  eventId: string;
  lane: number;
  startSeconds: number;
