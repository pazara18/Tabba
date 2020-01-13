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
  const groups: PitchFrameGroup[] = [];
  let group: PitchFrame[] = [];

  for (const frame of [...frames].sort((left, right) => left.startSeconds - right.startSeconds)) {
    const previous = group[group.length - 1];
    const gapSeconds = previous
      ? frame.startSeconds - (previous.startSeconds + previous.durationSeconds)
      : 0;

    if (!previous || (previous.pitch === frame.pitch && gapSeconds <= settings.maxFrameGapSeconds)) {
      group.push(frame);
    } else {
      groups.push({ frames: group });
      group = [frame];
    }
  }

  if (group.length > 0) {
    groups.push({ frames: group });
  }

  return groups;
}

function mergePitchWobbleGroups(
  groups: PitchFrameGroup[],
  settings: Required<typeof defaultGroupingOptions>
): PitchFrameGroup[] {
  return groups.reduce<PitchFrameGroup[]>((mergedGroups, group) => {
    const previous = mergedGroups[mergedGroups.length - 1];

    if (previous && shouldMergePitchWobble(previous, group, settings)) {
      previous.frames = [...previous.frames, ...group.frames];
