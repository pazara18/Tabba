import { describe, expect, it } from "vitest";
import { standardBassTuning, standardGuitarTuning } from "./standardTunings";

describe("standardTunings", () => {
  it("defines guitar strings from highest to lowest pitch", () => {
    expect(standardGuitarTuning).toMatchObject({
      id: "guitar-standard",
      name: "Standard guitar",
      instrument: "guitar",
    });

    expect(standardGuitarTuning.strings).toEqual([
      { stringNumber: 1, openPitch: "E4" },
      { stringNumber: 2, openPitch: "B3" },
      { stringNumber: 3, openPitch: "G3" },
      { stringNumber: 4, openPitch: "D3" },
      { stringNumber: 5, openPitch: "A2" },
      { stringNumber: 6, openPitch: "E2" },
    ]);
  });

  it("defines bass strings from highest to lowest pitch", () => {
    expect(standardBassTuning).toMatchObject({
      id: "bass-standard",
      name: "Standard bass",
      instrument: "bass",
    });

    expect(standardBassTuning.strings).toEqual([
      { stringNumber: 1, openPitch: "G2" },
      { stringNumber: 2, openPitch: "D2" },
      { stringNumber: 3, openPitch: "A1" },
      { stringNumber: 4, openPitch: "E1" },
    ]);
  });
});
