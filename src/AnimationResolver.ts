export class AnimationResolver {
  frames: string[] = [];
  frameBuffer: number;
  loop: boolean;
  frameEnd: string;
  frameStart: string;
  frameIndex: number;
  framesLength: number;
  currentFrameIndex: number;

  constructor(frames: string[], frameBuffer: number, loop: boolean = true) {
    this.frames = frames;
    this.frameBuffer = frameBuffer;
    this.loop = loop;
    this.frameEnd = this.frames[frames.length - 1];
    this.frameStart = this.frames[0];
    this.framesLength = this.frames.length;
    this.currentFrameIndex = 0;
  }

  resolveFrame(time: number): string {
    this.frameIndex = Math.floor((time / this.frameBuffer) % this.frames.length);

    if (!this.loop) {
      if (this.currentFrameIndex < this.framesLength) {
        this.currentFrameIndex++;
        return this.frames[this.frameIndex];
      } else {
        this.currentFrameIndex = this.framesLength;
        return this.frameEnd;
      }
    }

    return this.frames[this.frameIndex];
  }

  

  setAnimationLoop(isLooping: boolean) {
    this.loop = isLooping;
  }
}
