import { describe, expect, it } from "vitest";
import { getFollowPlayheadScrollLeft } from "./followPlayheadScroll";

describe("followPlayheadScroll", () => {
  it("does not scroll when the playhead is comfortably visible", () => {
    expect(
      getFollowPlayheadScrollLeft({
        contentWidth: 2_000,
        currentScrollLeft: 500,
        playheadX: 900,
        viewportWidth: 800,
      })
    ).toBe(500);
  });

  it("scrolls forward before the playhead leaves the viewport", () => {
    expect(
      getFollowPlayheadScrollLeft({
        contentWidth: 2_000,
        currentScrollLeft: 0,
        playheadX: 700,
        viewportWidth: 800,
      })
    ).toBe(420);
  });

  it("scrolls backward when seeking behind the visible area", () => {
    expect(
      getFollowPlayheadScrollLeft({
        contentWidth: 2_000,
        currentScrollLeft: 800,
        playheadX: 300,
        viewportWidth: 800,
      })
    ).toBe(20);
  });

  it("clamps to the available scroll range", () => {
