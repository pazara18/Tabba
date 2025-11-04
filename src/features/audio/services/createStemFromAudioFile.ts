import type { Stem } from "../../project/types";
import type { AudioStemFile } from "../types";

interface CreateStemOptions {
  createId?: () => string;
}

const defaultCreateId = () => crypto.randomUUID();

export function createStemFromAudioFile(
  file: AudioStemFile,
  options: CreateStemOptions = {}
): Stem {
  const createId = options.createId ?? defaultCreateId;

  return {
    id: createId(),
    name: createStemName(file.name),
    offsetSeconds: 0,
    file: {
      name: file.name,
      type: file.type,
      sizeBytes: file.size,
      lastModifiedMs: file.lastModified,
    },
  };
}

function createStemName(fileName: string): string {
  const trimmedName = fileName.trim();
  const extensionStart = trimmedName.lastIndexOf(".");

  if (extensionStart <= 0) {
    return trimmedName || "Untitled stem";
  }

  return trimmedName.slice(0, extensionStart);
}
