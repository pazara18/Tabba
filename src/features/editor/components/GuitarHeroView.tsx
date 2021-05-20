import { useMemo } from "react";
import type { TabTrack } from "../../project/types";
import {
  eventsToGhTrack,
  GH_LANE_COUNT,
  GH_LANE_NAMES,
  type GhNote,
} from "../services/guitarHeroLanes";
import styles from "./GuitarHeroView.module.css";

