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
