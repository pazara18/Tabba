import { useCallback, useMemo, useState } from "react";
import type { InstrumentKind } from "../domain/instruments/types";
import type { SelectedTabEvent } from "../features/editor/types";
import { useAnalyzeTrack } from "../features/analysis/hooks/useAnalyzeTrack";
import { EditorWorkspace } from "../features/editor/components/EditorWorkspace";
import { useRuntimeStemSources } from "../features/audio/hooks/useRuntimeStemSources";
import {
  toggleStemMute,
  toggleStemSolo,
  type StemMix,
} from "../features/audio/services/stemMixState";
import { createProject } from "../features/project/services/createProject";
import { createProjectFileName } from "../features/project/services/createProjectFileName";
import { normalizeFileBaseName } from "../features/project/services/normalizeFileBaseName";
import { createManualTabEvent } from "../features/project/services/createManualTabEvent";
import { createTabTrack } from "../features/project/services/createTabTrack";
import { downloadTextFile } from "../features/project/browser/downloadProjectFile";
import { importProjectJson } from "../features/project/services/importProjectJson";
import { serializeProject } from "../features/project/services/serializeProject";
import { trackToCloneHeroChart } from "../features/export/services/cloneHeroChart";
import { trackToRocksmithXml } from "../features/export/services/rocksmithXml";
import { addStemToProject, setStemDuration } from "../features/project/services/updateProjectStems";
import {
  addEventToTrack,
  addTrackToProject,
  deleteEventFromTrack,
  shiftSuggestedEventsInTrack,
  updateManualEvent,
} from "../features/project/services/updateProjectTracks";
import type { EventPopoverPatch } from "../features/editor/components/EventPopover";
import type { Stem } from "../features/project/types";
import styles from "./App.module.css";

export function App() {
  const [project, setProject] = useState(() =>
    createProject({ name: "Untitled Suno Stem Tabs" })
  );
  const [activeStemId, setActiveStemId] = useState<string | undefined>();
  const [selectedEvent, setSelectedEvent] = useState<SelectedTabEvent | undefined>();
  const [projectNotice, setProjectNotice] = useState<string | undefined>();
  const [mixStates, setMixStates] = useState<Record<string, StemMix>>({});

  const handleToggleStemMute = useCallback((stemId: string) => {
    setMixStates((current) => toggleStemMute(current, stemId));
  }, []);

  const handleToggleStemSolo = useCallback((stemId: string) => {
    setMixStates((current) => toggleStemSolo(current, stemId));
  }, []);

  const handleStemsCreated = useCallback((stems: Stem[]) => {
    const updatedAt = new Date();

    setProject((currentProject) =>
      stems.reduce(
        (nextProject, stem) => addStemToProject(nextProject, stem, updatedAt),
        currentProject
      )
    );
    setActiveStemId((currentStemId) => currentStemId ?? stems[0]?.id);
  }, []);

  const { clearSources, importFiles, sources } = useRuntimeStemSources({
    existingStems: project.stems,
    onStemsCreated: handleStemsCreated,
  });

  const activeSource = useMemo(
    () => sources.find((source) => source.stemId === activeStemId),
    [activeStemId, sources]
  );

  const handleStemDurationChange = useCallback((stemId: string, duration: number) => {
    setProject((currentProject) =>
      setStemDuration(currentProject, stemId, duration, new Date())
    );
  }, []);

  const handleCreateTrack = useCallback(
    (instrument: InstrumentKind) => {
      if (!activeStemId) {
        return;
      }

      const track = createTabTrack({ instrument, stemId: activeStemId });
      setProject((currentProject) => addTrackToProject(currentProject, track, new Date()));
      setSelectedEvent(undefined);
    },
    [activeStemId]
  );

  const handleAddManualEvent = useCallback(
    (trackId: string, stringNumber: number, fret: number, startSeconds: number) => {
      setProject((currentProject) => {
        const track = currentProject.tracks.find((candidate) => candidate.id === trackId);

        if (!track) {
          return currentProject;
        }

        const event = createManualTabEvent({
          fret,
          startSeconds,
          stringNumber,
          tuning: track.tuning,
        });

        setSelectedEvent({ eventId: event.id, trackId });
        return addEventToTrack(currentProject, trackId, event, new Date());
      });
    },
    []
  );

  const handleAnalyzeTrack = useAnalyzeTrack({
    activeSource,
    project,
    setProject,
    setProjectNotice,
  });

  const handleShiftSuggestions = useCallback((trackId: string, deltaSeconds: number) => {
    setProject((currentProject) =>
      shiftSuggestedEventsInTrack(currentProject, trackId, deltaSeconds, new Date())
    );
    setProjectNotice(
      `Shifted unlocked suggestions ${deltaSeconds > 0 ? "later" : "earlier"} by ${Math.abs(
        deltaSeconds * 1000
      )}ms.`
    );
  }, []);

  const handleUpdateSelectedEvent = useCallback(
    (patch: EventPopoverPatch) => {
      if (!selectedEvent) {
        return;
      }

      setProject((currentProject) =>
        updateManualEvent(
          currentProject,
          selectedEvent.trackId,
          selectedEvent.eventId,
          patch,
          new Date()
        )
      );
    },
    [selectedEvent]
  );

  const handleClearSelectedEvent = useCallback(() => {
    setSelectedEvent(undefined);
  }, []);

  const handleDeleteSelectedEvent = useCallback(() => {
    if (!selectedEvent) {
      return;
    }

    setProject((currentProject) =>
      deleteEventFromTrack(
        currentProject,
        selectedEvent.trackId,
        selectedEvent.eventId,
        new Date()
