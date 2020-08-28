import type { Stem } from "../../project/types";
import { createStemFromAudioFile } from "./createStemFromAudioFile";
import { findMatchingStemForAudioFile } from "./matchStemSource";
import type { RuntimeStemSource } from "../types";

export interface RuntimeStemImport {
  source: RuntimeStemSource;
  stem: Stem;
}

export function createRuntimeStemImports(
  files: FileList | File[],
  existingStems: Stem[]
