export class AnimationResolver {
  frames: string[] = [];
  frameLength: number;
  loop: boolean;

  constructor(frames: string[], frameLength: number, loop: boolean = true) {
    this.frames = frames;
    this.frameLength = frameLength;
    this.loop = loop;
  }

  resolveFrame(time: number): string {
    const frameIndex = Math.floor((time / this.frameLength) % this.frames.length);
    return this.frames[frameIndex];
  }

  setAnimationLoop(isLooping: boolean) {
    this.loop = isLooping;
  }
}
