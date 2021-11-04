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
