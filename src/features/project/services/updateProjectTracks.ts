import type { TabEvent } from "../../../domain/tab/types";
import type { TabTrack, TabbaProject } from "../types";
import { createManualTabPosition } from "./createManualTabEvent";
import { createPositionCandidates } from "../../../domain/fingering/fretboardCandidates";

interface ManualEventPatch {
  durationSeconds?: number;
  fret?: number;
  startSeconds?: number;
  stringNumber?: number;
}

export function addTrackToProject(
  project: TabbaProject,
  track: TabTrack,
  updatedAt: Date
