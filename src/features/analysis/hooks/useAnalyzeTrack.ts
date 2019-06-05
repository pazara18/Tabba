import { useCallback, type Dispatch, type SetStateAction } from "react";
import { decodeAudioFile } from "../../audio/browser/decodeAudioFile";
import type { RuntimeStemSource } from "../../audio/types";
import { replaceSuggestedEventsInTrack } from "../../project/services/updateProjectTracks";
import type { TabbaProject } from "../../project/types";
import { createSuggestedTabEvents } from "../services/createSuggestedTabEvents";
import { getInstrumentPitchOptions } from "../services/instrumentAnalysisOptions";
import { alignNotesToEnergyOnsets } from "../services/noteOnsetAlignment";
import { analyzePitchFrames, groupPitchFrames } from "../services/pitchDetection";

interface UseAnalyzeTrackOptions {
  activeSource?: RuntimeStemSource;
  project: TabbaProject;
  setProject: Dispatch<SetStateAction<TabbaProject>>;
  setProjectNotice: (notice: string) => void;
}

export function useAnalyzeTrack({
  activeSource,
  project,
  setProject,
  setProjectNotice,
}: UseAnalyzeTrackOptions) {
  return useCallback(
    (trackId: string) => {
      const track = project.tracks.find((candidate) => candidate.id === trackId);

