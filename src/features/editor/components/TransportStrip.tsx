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
  return (
    <header className={styles.transport}>
      <div className={styles.identity}>
        <p>Tabba</p>
        <h1>{projectName}</h1>
      </div>
      <ProjectActions onExportProject={onExportProject} onImportProject={onImportProject} />
