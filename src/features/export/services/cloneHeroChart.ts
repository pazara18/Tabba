import type { TabTrack } from "../../project/types";
import {
  eventsToGhTrack,
  GH_LANE_COUNT,
  type GhNote,
} from "../../editor/services/guitarHeroLanes";
import { estimateTempoFromOnsets } from "../../analysis/services/tempoInference";

export interface CloneHeroChartMetadata {
  artist?: string;
  charter?: string;
  musicStream?: string;
