import { pitchToMidi } from "../../../domain/pitch/pitchNames";
import type { DetectedNote, PitchFrame } from "../types";
import type { PitchDetectionOptions } from "./pitchDetection";

interface PitchFrameGroup {
  frames: PitchFrame[];
}

const defaultGroupingOptions = {
  maxFrameGapSeconds: 0.12,
  minDurationSeconds: 0.08,
  pitchWobbleMergeSeconds: 0.18,
  pitchWobbleSemitones: 1,
};

export function groupPitchFrames(
  frames: PitchFrame[],
  options: PitchDetectionOptions = {}
): DetectedNote[] {
  const settings = { ...defaultGroupingOptions, ...options };
  const groups = mergePitchWobbleGroups(createPitchFrameGroups(frames, settings), settings);

  return groups.flatMap((group) => createDetectedNote(group, settings.minDurationSeconds));
}

function createPitchFrameGroups(
  frames: PitchFrame[],
  settings: Required<typeof defaultGroupingOptions>
): PitchFrameGroup[] {
