import { describe, expect, it } from "vitest";
import { createProjectFixture } from "../../../test/fixtures/createProjectFixture";
import { createRuntimeStemImports } from "./createRuntimeStemImports";

describe("createRuntimeStemImports", () => {
  it("dedupes duplicate files imported in the same batch", () => {
    const file = new File(["audio"], "lead.wav", { type: "audio/wav" });
    const imports = createRuntimeStemImports([file, file], []);

    expect(imports).toHaveLength(1);
    expect(imports[0].source.stemId).toBe(imports[0].stem.id);
  });

  it("dedupes multiple files that match the same existing stem", () => {
    const project = createProjectFixture();
    const fileA = new File([new Uint8Array(2048)], "lead.wav", { type: "audio/wav" });
    const fileB = new File([new Uint8Array(2048)], "lead.wav", { type: "audio/wav" });
    const imports = createRuntimeStemImports([fileA, fileB], project.stems);
