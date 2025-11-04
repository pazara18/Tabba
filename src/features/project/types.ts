import type { InstrumentKind, InstrumentTuning } from "../../domain/instruments/types";
import type { TabEvent } from "../../domain/tab/types";

export const PROJECT_SCHEMA_VERSION = 1;

export interface StemFileMetadata {
  name: string;
  type: string;
  sizeBytes: number;
  lastModifiedMs?: number;
}

export interface Stem {
  id: string;
  name: string;
  durationSeconds?: number;
  offsetSeconds: number;
  file?: StemFileMetadata;
}

export interface TabTrack {
  id: string;
  stemId: string;
  name: string;
  instrument: InstrumentKind;
  tuning: InstrumentTuning;
  events: TabEvent[];
}

export interface TabbaProject {
  schemaVersion: typeof PROJECT_SCHEMA_VERSION;
  id: string;
  name: string;
  stems: Stem[];
  tracks: TabTrack[];
  createdAt: string;
  updatedAt: string;
}
