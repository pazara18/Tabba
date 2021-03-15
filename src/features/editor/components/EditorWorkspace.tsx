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
