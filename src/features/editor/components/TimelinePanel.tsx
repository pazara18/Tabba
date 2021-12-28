import styles from "./TimelinePanel.module.css";
import type { WaveformPeak } from "../../audio/services/waveformPeaks";
import { getPeakHeightPercent } from "../../audio/services/waveformPeaks";
import type { LoopRegion } from "../services/practiceControls";
import { normalizeLoopRegion } from "../services/practiceControls";
import {
  createTimelineMarkers,
  formatTimelineMarker,
  getTimelinePercent,
} from "../services/timelineLayout";
import { PracticeControls } from "./PracticeControls";

interface TimelinePanelProps {
  currentTime: number;
  duration: number;
  loopRegion: LoopRegion;
  onLoopRegionChange: (loopRegion: LoopRegion) => void;
  onPlaybackRateChange: (playbackRate: number) => void;
  onSeek: (timeSeconds: number) => void;
  playbackRate: number;
  waveformError?: string;
  waveformLoading: boolean;
  waveformPeaks: WaveformPeak[];
}

export function TimelinePanel({
  currentTime,
  duration,
  loopRegion,
  onLoopRegionChange,
  onPlaybackRateChange,
  onSeek,
  playbackRate,
  waveformError,
  waveformLoading,
  waveformPeaks,
}: TimelinePanelProps) {
  const markers = createMarkers(duration);
  const playheadPercent = getTimelinePercent(currentTime, duration);
  const normalizedLoop = normalizeLoopRegion(loopRegion, duration);
  const loopStartPercent = getTimelinePercent(normalizedLoop.startSeconds, duration);
  const loopWidthPercent =
    getTimelinePercent(normalizedLoop.endSeconds, duration) - loopStartPercent;

  return (
    <section className={styles.timeline} aria-label="Timeline">
      <div className={styles.markerRow}>
        {markers.map((marker) => (
          <span key={marker.time}>{formatTimelineMarker(marker.time)}</span>
        ))}
      </div>
      <button
        className={styles.waveform}
        onClick={(event) => {
          const bounds = event.currentTarget.getBoundingClientRect();
          const ratio = (event.clientX - bounds.left) / bounds.width;
          onSeek(ratio * duration);
        }}
        type="button"
      >
        {normalizedLoop.enabled && (
          <span
            className={styles.loopRegion}
            style={{ left: `${loopStartPercent}%`, width: `${loopWidthPercent}%` }}
          />
        )}
        <span className={styles.playhead} style={{ left: `${playheadPercent}%` }} />
