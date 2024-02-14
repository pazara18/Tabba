import { standardGuitarTuning } from "../../domain/instruments/standardTunings";
import type { TabbaProject } from "../../features/project/types";
import { PROJECT_SCHEMA_VERSION } from "../../features/project/types";

export function createProjectFixture(): TabbaProject {
  return {
    schemaVersion: PROJECT_SCHEMA_VERSION,
    id: "project-1",
    name: "Stem tabs",
    createdAt: "2026-04-15T12:00:00.000Z",
    updatedAt: "2026-04-15T12:00:00.000Z",
    stems: [
      {
        id: "stem-1",
        name: "Lead stem",
        durationSeconds: 60,
        offsetSeconds: 0,
        file: {
          name: "lead.wav",
          type: "audio/wav",
          sizeBytes: 2048,
          lastModifiedMs: 1770000000000,
        },
      },
    ],
    tracks: [
      {
        id: "track-1",
        stemId: "stem-1",
        name: "Lead guitar",
        instrument: "guitar",
        tuning: standardGuitarTuning,
