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
): RuntimeStemImport[] {
  const stemsById = new Map(existingStems.map((stem) => [stem.id, stem]));
  const importedByStemId = new Map<string, RuntimeStemImport>();

  for (const file of Array.from(files)) {
    const knownStems = [...stemsById.values()];
    const stem = findMatchingStemForAudioFile(file, knownStems) ?? createStemFromAudioFile(file);

    stemsById.set(stem.id, stem);
    importedByStemId.set(stem.id, { stem, source: { stemId: stem.id, file } });
  }

  return [...importedByStemId.values()];
}
