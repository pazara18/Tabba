import styles from "./TimelinePanel.module.css";
import type { WaveformPeak } from "../../audio/services/waveformPeaks";
import { getPeakHeightPercent } from "../../audio/services/waveformPeaks";
import type { LoopRegion } from "../services/practiceControls";
import { normalizeLoopRegion } from "../services/practiceControls";
import {
  createTimelineMarkers,
  formatTimelineMarker,
  getTimelinePercent,
