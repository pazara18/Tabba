import { useState } from "react";
import type { InstrumentKind } from "../../../domain/instruments/types";
import { StemLane } from "../../audio/components/StemLane";
import { useProjectTransport } from "../../audio/hooks/useProjectTransport";
import { useDecodedWaveform } from "../../audio/hooks/useDecodedWaveform";
import type { StemMix } from "../../audio/services/stemMixState";
import type { RuntimeStemSource } from "../../audio/types";
import type { TabbaProject } from "../../project/types";
import type { EventPopoverPatch } from "./EventPopover";
import { TabStaffPanel } from "./TabStaffPanel";
import { TimelinePanel } from "./TimelinePanel";
import { TransportStrip } from "./TransportStrip";
import styles from "./EditorWorkspace.module.css";
import type { SelectedTabEvent } from "../types";
import { createDefaultLoopRegion, normalizePlaybackRate } from "../services/practiceControls";

interface EditorWorkspaceProps {
  activeSource?: RuntimeStemSource;
  activeStemId?: string;
  mixStates: Record<string, StemMix>;
  onActiveStemChange: (stemId: string) => void;
  onAddManualEvent: (
    trackId: string,
    stringNumber: number,
    fret: number,
    startSeconds: number
  ) => void;
  onAnalyzeTrack: (trackId: string) => void;
  onClearSelectedEvent: () => void;
  onCreateTrack: (instrument: InstrumentKind) => void;
  onDeleteSelectedEvent: () => void;
  onExportCloneHero: (trackId: string) => void;
  onExportProject: () => void;
  onExportRocksmith: (trackId: string) => void;
  onImportProject: (file: File) => void;
  onSelectEvent: (selection: SelectedTabEvent) => void;
  onShiftSuggestions: (trackId: string, deltaSeconds: number) => void;
  onUpdateSelectedEvent: (patch: EventPopoverPatch) => void;
  onImportFiles: (files: FileList | File[]) => void;
  onStemDurationChange: (stemId: string, duration: number) => void;
  onToggleStemMute: (stemId: string) => void;
  onToggleStemSolo: (stemId: string) => void;
  project: TabbaProject;
  projectNotice?: string;
  selectedEvent?: SelectedTabEvent;
  sources: RuntimeStemSource[];
}

export function EditorWorkspace({
  activeSource,
  activeStemId,
  mixStates,
  onActiveStemChange,
  onAddManualEvent,
  onAnalyzeTrack,
  onClearSelectedEvent,
  onCreateTrack,
  onDeleteSelectedEvent,
  onExportCloneHero,
  onExportProject,
  onExportRocksmith,
  onImportProject,
  onSelectEvent,
  onShiftSuggestions,
  onUpdateSelectedEvent,
  onImportFiles,
  onStemDurationChange,
  onToggleStemMute,
  onToggleStemSolo,
  project,
  projectNotice,
  selectedEvent,
  sources,
}: EditorWorkspaceProps) {
  const [loopRegion, setLoopRegion] = useState(() => createDefaultLoopRegion(60));
  const [playbackRate, setPlaybackRate] = useState(1);
  const transport = useProjectTransport({
    sources,
    mixStates,
    loopRegion,
    onStemDurationChange,
    playbackRate,
  });
  const waveform = useDecodedWaveform(activeSource?.file);
  const longestStemDuration = project.stems.reduce(
    (max, stem) => Math.max(max, stem.durationSeconds ?? 0),
    0
  );
  const timelineDuration = Math.max(longestStemDuration, transport.duration, 60);

  return (
    <div className={styles.workspace}>
      <TransportStrip
        currentTime={transport.currentTime}
        hasSource={transport.hasSource}
        isPlaying={transport.isPlaying}
        onExportProject={onExportProject}
        onImportProject={onImportProject}
        onPause={transport.pause}
        onPlay={transport.play}
        onStop={transport.stop}
        projectName={project.name}
      />
      <div className={styles.body}>
        <aside className={styles.sidebar}>
          <StemLane
            activeStemId={activeStemId}
            mixStates={mixStates}
            onImportFiles={onImportFiles}
            onSelectStem={onActiveStemChange}
            onToggleMute={onToggleStemMute}
            onToggleSolo={onToggleStemSolo}
            projectNotice={projectNotice}
            stems={project.stems}
          />
        </aside>
        <div className={styles.mainColumn}>
          <TimelinePanel
            currentTime={transport.currentTime}
            duration={timelineDuration}
            loopRegion={loopRegion}
            onLoopRegionChange={setLoopRegion}
            onPlaybackRateChange={(rate) => setPlaybackRate(normalizePlaybackRate(rate))}
            onSeek={transport.seek}
            playbackRate={playbackRate}
            waveformError={waveform.error}
            waveformLoading={waveform.isLoading}
            waveformPeaks={waveform.peaks}
          />
          <TabStaffPanel
            activeStemId={activeStemId}
            currentTime={transport.currentTime}
            duration={timelineDuration}
            onAddNote={(trackId, stringNumber, fret, startSeconds) =>
              onAddManualEvent(trackId, stringNumber, fret, startSeconds)
            }
            onAnalyzeTrack={onAnalyzeTrack}
            onClearSelectedEvent={onClearSelectedEvent}
            onCreateTrack={onCreateTrack}
            onDeleteSelectedEvent={onDeleteSelectedEvent}
            onExportCloneHero={onExportCloneHero}
            onExportRocksmith={onExportRocksmith}
            onSelectEvent={onSelectEvent}
            onShiftSuggestions={onShiftSuggestions}
            onUpdateSelectedEvent={onUpdateSelectedEvent}
            selectedEvent={selectedEvent}
            tracks={project.tracks}
          />
        </div>
      </div>
    </div>
  );
}
