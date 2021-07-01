import { useEffect, useRef, type CSSProperties } from "react";
import type { TabEvent } from "../../../domain/tab/types";
import type { TabTrack } from "../../project/types";
import {
  createTabLines,
  getActiveLineIndex,
  getEventsForLine,
  getLineRelativePercent,
  type TabLine,
} from "../services/tabLineLayout";
import type { SelectedTabEvent } from "../types";
import { EventPopover, type EventPopoverPatch } from "./EventPopover";
import styles from "./ManualTrackStaff.module.css";

interface ManualTrackStaffProps {
  currentTime: number;
  duration: number;
  onAddNote: (trackId: string, stringNumber: number, startSeconds: number) => void;
  onAnalyzeTrack: (trackId: string) => void;
  onClearSelectedEvent: () => void;
  onDeleteSelectedEvent: () => void;
  onSelectEvent: (selection: SelectedTabEvent) => void;
  onShiftSuggestions: (trackId: string, deltaSeconds: number) => void;
  onUpdateSelectedEvent: (patch: EventPopoverPatch) => void;
  selectedEvent?: SelectedTabEvent;
  track: TabTrack;
}
