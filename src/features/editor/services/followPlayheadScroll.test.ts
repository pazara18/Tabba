import { describe, expect, it } from "vitest";
import { getFollowPlayheadScrollLeft } from "./followPlayheadScroll";

describe("followPlayheadScroll", () => {
  it("does not scroll when the playhead is comfortably visible", () => {
