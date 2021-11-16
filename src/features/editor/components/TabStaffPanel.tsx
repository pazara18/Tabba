import { useEffect, useState } from "react";
import type { InstrumentKind } from "../../../domain/instruments/types";
import type { TabTrack } from "../../project/types";
import type { EventPopoverPatch } from "./EventPopover";
import { GuitarHeroView } from "./GuitarHeroView";
import { ManualTrackStaff } from "./ManualTrackStaff";
import { RawTabView } from "./RawTabView";
import styles from "./TabStaffPanel.module.css";
import { TrackCreationPanel } from "./TrackCreationPanel";
import type { SelectedTabEvent } from "../types";

type TabViewMode = "staff" | "raw" | "gh";

interface TabStaffPanelProps {
  activeStemId?: string;
  currentTime: number;
  duration: number;
  onAddNote: (
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
  onExportRocksmith: (trackId: string) => void;
  onSelectEvent: (selection: SelectedTabEvent) => void;
  onShiftSuggestions: (trackId: string, deltaSeconds: number) => void;
  onUpdateSelectedEvent: (patch: EventPopoverPatch) => void;
  selectedEvent?: SelectedTabEvent;
  tracks: TabTrack[];
}

export function TabStaffPanel({
  activeStemId,
  currentTime,
  duration,
  onAddNote,
  onAnalyzeTrack,
  onClearSelectedEvent,
  onCreateTrack,
  onDeleteSelectedEvent,
  onExportCloneHero,
  onExportRocksmith,
  onSelectEvent,
  onShiftSuggestions,
  onUpdateSelectedEvent,
  selectedEvent,
  tracks,
}: TabStaffPanelProps) {
  const [selectedFret, setSelectedFret] = useState(0);
  const [selectedTrackId, setSelectedTrackId] = useState<string | undefined>(undefined);
  const [viewMode, setViewMode] = useState<TabViewMode>("staff");
  const activeTracks = tracks.filter((track) => track.stemId === activeStemId);
  const selectedTrack =
    activeTracks.find((track) => track.id === selectedTrackId) ?? activeTracks[0];

  useEffect(() => {
    if (selectedEvent && selectedEvent.trackId !== selectedTrackId) {
      const matchingTrack = activeTracks.find((track) => track.id === selectedEvent.trackId);
      if (matchingTrack) {
        setSelectedTrackId(matchingTrack.id);
      }
    }
  }, [activeTracks, selectedEvent, selectedTrackId]);

  useEffect(() => {
    if (!selectedTrack && activeTracks.length > 0) {
      setSelectedTrackId(activeTracks[0].id);
    }
    if (selectedTrack && selectedTrackId !== selectedTrack.id) {
      setSelectedTrackId(selectedTrack.id);
    }
  }, [activeTracks, selectedTrack, selectedTrackId]);

  return (
    <section className={styles.panel} aria-label="Tab staff">
      <div className={styles.header}>
        <div>
          <h2>Tab Staff</h2>
          <span>{activeTracks.length} active tracks</span>
        </div>
        <div className={styles.headerControls}>
          <div className={styles.viewToggle} role="tablist" aria-label="Tab view mode">
            <button
              aria-pressed={viewMode === "staff"}
              className={viewMode === "staff" ? styles.viewToggleActive : styles.viewToggleButton}
              onClick={() => setViewMode("staff")}
              type="button"
            >
              Staff
            </button>
            <button
              aria-pressed={viewMode === "raw"}
              className={viewMode === "raw" ? styles.viewToggleActive : styles.viewToggleButton}
              onClick={() => setViewMode("raw")}
              type="button"
            >
              Raw
            </button>
            <button
              aria-label="Guitar Hero view"
              aria-pressed={viewMode === "gh"}
              className={viewMode === "gh" ? styles.viewToggleActive : styles.viewToggleButton}
              onClick={() => setViewMode("gh")}
              type="button"
            >
              Guitar Hero
            </button>
          </div>
          {selectedTrack && (
            <div className={styles.exportButtons}>
              <button
                aria-label="Export Clone Hero chart"
                onClick={() => onExportCloneHero(selectedTrack.id)}
                type="button"
              >
                Export .chart
              </button>
              <button
                aria-label="Export Rocksmith XML"
                onClick={() => onExportRocksmith(selectedTrack.id)}
                type="button"
              >
                Export .xml
              </button>
            </div>
          )}
          {activeStemId && <TrackCreationPanel onCreateTrack={onCreateTrack} />}
        </div>
      </div>
      <div className={styles.tools}>
        <label>
          Fret
