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
