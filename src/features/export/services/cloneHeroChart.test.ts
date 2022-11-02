import { describe, expect, it } from "vitest";
import { standardGuitarTuning } from "../../../domain/instruments/standardTunings";
import type { TabEvent } from "../../../domain/tab/types";
import type { TabTrack } from "../../project/types";
import { inferBpmForTrack, trackToCloneHeroChart } from "./cloneHeroChart";

function makeEvent(
  id: string,
  startSeconds: number,
