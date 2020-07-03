import { useCallback, useState } from "react";
import type { Stem } from "../../project/types";
import { createRuntimeStemImports } from "../services/createRuntimeStemImports";
import type { RuntimeStemSource } from "../types";

interface UseRuntimeStemSourcesOptions {
  existingStems?: Stem[];
  onStemsCreated: (stems: Stem[]) => void;
}

export function useRuntimeStemSources({
