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
