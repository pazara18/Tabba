import { describe, expect, it } from "vitest";
import type { TabEvent } from "../../../domain/tab/types";
import { bucketMidiToLane, eventsToGhTrack, GH_LANE_COUNT } from "./guitarHeroLanes";

function makeEvent(
  id: string,
  startSeconds: number,
  positions: { pitch: string; stringNumber?: number; fret?: number }[],
  durationSeconds = 0.25
): TabEvent {
