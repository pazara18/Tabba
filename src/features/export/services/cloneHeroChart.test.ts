import { describe, expect, it } from "vitest";
import { standardGuitarTuning } from "../../../domain/instruments/standardTunings";
import type { TabEvent } from "../../../domain/tab/types";
import type { TabTrack } from "../../project/types";
import { inferBpmForTrack, trackToCloneHeroChart } from "./cloneHeroChart";

function makeEvent(
  id: string,
  startSeconds: number,
  pitch: string,
  durationSeconds = 0.25
): TabEvent {
  return {
    id,
    startSeconds,
    durationSeconds,
    kind: "single",
    texture: "mono",
    detectedPitches: [],
    chosenPositions: [{ stringNumber: 1, fret: 0, pitch }],
    candidates: [],
    confidence: 1,
    locked: false,
  };
}

function makeTrack(events: TabEvent[]): TabTrack {
  return {
    id: "track-1",
    stemId: "stem-1",
    name: "Lead",
    instrument: "guitar",
    tuning: standardGuitarTuning,
