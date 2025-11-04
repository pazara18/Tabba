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

      if (!track || !activeSource) {
        setProjectNotice("Import audio and create a track before analyzing.");
        return;
      }

      if (activeSource.stemId !== track.stemId) {
        setProjectNotice("Select the stem attached to this track before analyzing.");
        return;
      }

      setProjectNotice("Analyzing selected stem...");
      decodeAudioFile(activeSource.file)
        .then((decoded) => {
          const options = getInstrumentPitchOptions(track.instrument);
          const frames = analyzePitchFrames(decoded.samples, decoded.sampleRate, options);
          const notes = alignNotesToEnergyOnsets(
            groupPitchFrames(frames, options),
            decoded.samples,
            decoded.sampleRate
          );
          const events = createSuggestedTabEvents(notes, track.tuning, {
            lockedEvents: track.events.filter((event) => event.locked),
          });

          const htmlAudioDurationSeconds = project.stems.find(
            (stem) => stem.id === track.stemId
          )?.durationSeconds;
          console.info("[tabba analyze diagnostic]", {
            trackId,
            decodedDurationSeconds: decoded.durationSeconds,
            decodedSampleRate: decoded.sampleRate,
            decodedSampleCount: decoded.samples.length,
            htmlAudioDurationSeconds,
            durationDeltaSeconds:
              htmlAudioDurationSeconds === undefined
                ? undefined
                : decoded.durationSeconds - htmlAudioDurationSeconds,
            firstEventStartSeconds: events[0]?.startSeconds,
            lastEventStartSeconds: events[events.length - 1]?.startSeconds,
            eventCount: events.length,
          });

          setProject((currentProject) =>
            replaceSuggestedEventsInTrack(currentProject, trackId, events, new Date())
          );
          setProjectNotice(`Analysis found ${events.length} suggested notes.`);
        })
        .catch((error: unknown) => {
          setProjectNotice(error instanceof Error ? error.message : "Analysis failed.");
        });
    },
    [activeSource, project.stems, project.tracks, setProject, setProjectNotice]
  );
}
