import { describe, expect, it } from "vitest";
import { standardBassTuning, standardGuitarTuning } from "../../../domain/instruments/standardTunings";
import type { TabEvent } from "../../../domain/tab/types";
import type { TabTrack } from "../../project/types";
import { trackToAsciiTab } from "./trackToAsciiTab";

function makeEvent(
  id: string,
  startSeconds: number,
  positions: { stringNumber: number; fret: number }[]
): TabEvent {
  return {
    id,
    startSeconds,
    durationSeconds: 0.25,
    kind: "single",
    texture: "mono",
    detectedPitches: [],
    chosenPositions: positions.map((position) => ({
      stringNumber: position.stringNumber,
      fret: position.fret,
      pitch: "",
    })),
