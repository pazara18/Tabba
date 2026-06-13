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
        events: [
          {
            id: "event-1",
            startSeconds: 1,
            durationSeconds: 0.5,
            kind: "single",
            texture: "mono",
            detectedPitches: [{ pitch: "E3", confidence: 0.9, frequencyHz: 164.81 }],
            chosenPositions: [{ stringNumber: 4, fret: 2, pitch: "E3" }],
            candidates: [],
            confidence: 0.9,
            locked: false,
          },
        ],
      },
    ],
  };
}
