export type Animation = (distance: number) => string;

export function createAnimation(frames: string[], frameBuffer: number): Animation {
  return function resolveFrame(time: number) {
    const frameIndex = Math.floor((time / frameBuffer) % frames.length);
    return frames[frameIndex];
  };
}
