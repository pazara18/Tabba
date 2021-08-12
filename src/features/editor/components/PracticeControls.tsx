import type { LoopRegion } from "../services/practiceControls";
import { normalizeLoopRegion, playbackRates } from "../services/practiceControls";
import styles from "./PracticeControls.module.css";

interface PracticeControlsProps {
  duration: number;
  loopRegion: LoopRegion;
  onLoopRegionChange: (loopRegion: LoopRegion) => void;
