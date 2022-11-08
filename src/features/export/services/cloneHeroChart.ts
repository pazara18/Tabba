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
  name?: string;
}

export interface CloneHeroChartOptions {
  bpm?: number;
  difficulty?: "ExpertSingle" | "HardSingle" | "MediumSingle" | "EasySingle";
  metadata?: CloneHeroChartMetadata;
  resolution?: number;
}

const DEFAULT_RESOLUTION = 192;
const DEFAULT_BPM = 120;
const DEFAULT_DIFFICULTY = "ExpertSingle";

export function trackToCloneHeroChart(
