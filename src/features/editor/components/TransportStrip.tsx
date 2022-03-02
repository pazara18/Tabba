import { formatPlaybackTime } from "../../audio/services/formatPlaybackTime";
import { ProjectActions } from "./ProjectActions";
import styles from "./TransportStrip.module.css";

interface TransportStripProps {
  currentTime: number;
  hasSource: boolean;
  isPlaying: boolean;
  onPause: () => void;
  onPlay: () => void;
  onExportProject: () => void;
  onImportProject: (file: File) => void;
  onStop: () => void;
  projectName: string;
}

export function TransportStrip({
  currentTime,
  hasSource,
  isPlaying,
  onExportProject,
  onImportProject,
  onPause,
  onPlay,
  onStop,
  projectName,
}: TransportStripProps) {
