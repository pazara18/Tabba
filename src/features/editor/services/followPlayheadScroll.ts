interface FollowPlayheadScrollOptions {
  contentWidth: number;
  currentScrollLeft: number;
  playheadX: number;
  targetRatio?: number;
  viewportWidth: number;
  visibilityPaddingRatio?: number;
}

const defaultTargetRatio = 0.35;
const defaultVisibilityPaddingRatio = 0.22;

export function getFollowPlayheadScrollLeft({
  contentWidth,
  currentScrollLeft,
