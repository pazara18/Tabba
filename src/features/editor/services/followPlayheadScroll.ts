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
  playheadX,
  targetRatio = defaultTargetRatio,
  viewportWidth,
  visibilityPaddingRatio = defaultVisibilityPaddingRatio,
}: FollowPlayheadScrollOptions): number {
  if (contentWidth <= viewportWidth || viewportWidth <= 0) {
    return 0;
  }

  const leftBoundary = currentScrollLeft + viewportWidth * visibilityPaddingRatio;
  const rightBoundary = currentScrollLeft + viewportWidth * (1 - visibilityPaddingRatio);
