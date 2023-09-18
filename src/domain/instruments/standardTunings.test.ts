import { describe, expect, it } from "vitest";
import { standardBassTuning, standardGuitarTuning } from "./standardTunings";

describe("standardTunings", () => {
  it("defines guitar strings from highest to lowest pitch", () => {
    expect(standardGuitarTuning).toMatchObject({
      id: "guitar-standard",
      name: "Standard guitar",
      instrument: "guitar",
    });
