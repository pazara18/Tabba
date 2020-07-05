import { useCallback, useState } from "react";
import type { Stem } from "../../project/types";
import { createRuntimeStemImports } from "../services/createRuntimeStemImports";
import type { RuntimeStemSource } from "../types";

interface UseRuntimeStemSourcesOptions {
  existingStems?: Stem[];
  onStemsCreated: (stems: Stem[]) => void;
}

export function useRuntimeStemSources({
  existingStems = [],
  onStemsCreated,
}: UseRuntimeStemSourcesOptions) {
  const [sources, setSources] = useState<RuntimeStemSource[]>([]);

  const importFiles = useCallback(
    (files: FileList | File[]) => {
      const imported = createRuntimeStemImports(files, existingStems);

      if (imported.length === 0) {
        return;
      }

