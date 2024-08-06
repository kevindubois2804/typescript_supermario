export type Animation = (distance: number) => string;

export function createAnim(frames: string[], frameLen: number): Animation {
  return function resolveFrame(distance: number) {
    const frameIndex = Math.floor(distance / frameLen) % frames.length;
    const frameName = frames[frameIndex];
    return frameName;
  };
}
