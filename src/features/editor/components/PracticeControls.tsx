import type { LoopRegion } from "../services/practiceControls";
import { normalizeLoopRegion, playbackRates } from "../services/practiceControls";
import styles from "./PracticeControls.module.css";

interface PracticeControlsProps {
  duration: number;
  loopRegion: LoopRegion;
  onLoopRegionChange: (loopRegion: LoopRegion) => void;
  onPlaybackRateChange: (playbackRate: number) => void;
  playbackRate: number;
}

export function PracticeControls({
  duration,
  loopRegion,
  onLoopRegionChange,
  onPlaybackRateChange,
  playbackRate,
}: PracticeControlsProps) {
