import { describe, expect, it } from "vitest";
import { standardBassTuning, standardGuitarTuning } from "../instruments/standardTunings";
import { createPositionCandidates, generatePitchPositions, scorePosition } from "./fretboardCandidates";

