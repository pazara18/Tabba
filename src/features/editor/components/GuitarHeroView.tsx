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

  const visibleNotes = ghTrack.notes.filter((note) => {
    const offset = note.startSeconds - currentTime;
    return offset >= -LOOK_BEHIND_SECONDS && offset <= LOOK_AHEAD_SECONDS;
  });

  const notesByLane = groupByLane(visibleNotes);

  return (
    <section className={styles.view} aria-label="Guitar Hero view">
      <div className={styles.header}>
        <span>
          <strong>{track.name}</strong> — {ghTrack.notes.length} notes
        </span>
        {ghTrack.pitchRange && (
          <span>
            pitch range MIDI {ghTrack.pitchRange.min}–{ghTrack.pitchRange.max}
          </span>
        )}
      </div>
      <div
        className={styles.board}
        style={{ "--lane-count": GH_LANE_COUNT } as React.CSSProperties}
      >
        <div className={styles.lanes}>
