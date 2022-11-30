import { describe, expect, it } from "vitest";
import { standardBassTuning, standardGuitarTuning } from "../../../domain/instruments/standardTunings";
import type { TabEvent } from "../../../domain/tab/types";
import type { TabTrack } from "../../project/types";
import { trackToRocksmithXml } from "./rocksmithXml";

function makeEvent(
  id: string,
  startSeconds: number,
  stringNumber: number,
  fret: number,
  pitch = "E2",
  durationSeconds = 0.25
): TabEvent {
  return {
    id,
    startSeconds,
    durationSeconds,
    kind: "single",
    texture: "mono",
    detectedPitches: [],
    chosenPositions: [{ stringNumber, fret, pitch }],
    candidates: [],
    confidence: 1,
    locked: false,
  };
