import { useMemo } from "react";
import type { TabTrack } from "../../project/types";
import {
  eventsToGhTrack,
  GH_LANE_COUNT,
  GH_LANE_NAMES,
  type GhNote,
} from "../services/guitarHeroLanes";
import styles from "./GuitarHeroView.module.css";

const LOOK_AHEAD_SECONDS = 2.5;
const LOOK_BEHIND_SECONDS = 0.35;
const STRIKE_PERCENT = 85;
const SUSTAIN_MIN_SECONDS = 0.25;

interface GuitarHeroViewProps {
  currentTime: number;
  track: TabTrack;
}

export function GuitarHeroView({ currentTime, track }: GuitarHeroViewProps) {
  const ghTrack = useMemo(() => eventsToGhTrack(track.events), [track.events]);
