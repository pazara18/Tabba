import type { InstrumentKind, InstrumentTuning } from "../../domain/instruments/types";
import type { TabEvent } from "../../domain/tab/types";

export const PROJECT_SCHEMA_VERSION = 1;

export interface StemFileMetadata {
  name: string;
  type: string;
