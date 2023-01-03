import { describe, expect, it } from "vitest";
import { standardGuitarTuning } from "../../../domain/instruments/standardTunings";
import { createManualTabEvent } from "./createManualTabEvent";

describe("createManualTabEvent", () => {
  it("creates a locked single-note event from a string and fret", () => {
    const event = createManualTabEvent({
