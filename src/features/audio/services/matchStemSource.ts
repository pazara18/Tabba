import type { Stem } from "../../project/types";
import type { AudioStemFile } from "../types";

export function findMatchingStemForAudioFile(
  file: AudioStemFile,
  stems: Stem[]
): Stem | undefined {
  return stems.find((stem) => {
    const metadata = stem.file;

