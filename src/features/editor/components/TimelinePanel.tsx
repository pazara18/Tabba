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
