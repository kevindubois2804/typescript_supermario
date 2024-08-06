import { Animation } from './animation';
import { raise } from './raise';

export default class SpriteSheet {
  tiles = new Map<string, HTMLCanvasElement[]>();
  animations = new Map<string, Animation>();
  constructor(public image: HTMLImageElement, public width: number, public height: number) {}

  define(name: string, x: number, y: number, width: number, height: number) {
    const buffers = [false, true].map((flipped) => {
      const buffer = document.createElement('canvas');
      buffer.width = width;
      buffer.height = height;

      const context = buffer.getContext('2d') || raise('Canvas not supported');

      if (flipped) {
        context.scale(-1, 1);
        context.translate(-width, 0);
      }

      context.drawImage(this.image, x, y, width, height, 0, 0, width, height);

      return buffer;
    });

    this.tiles.set(name, buffers);
  }

  defineTile(name: string, x: number, y: number) {
    this.define(name, x * this.width, y * this.height, this.width, this.height);
  }

  defineAnim(name: string, animation: Animation) {
    this.animations.set(name, animation);
  }

  // draw a buffer
  draw(name: string, context: CanvasRenderingContext2D, x: number, y: number, flip = false) {
    const buffers = this.tiles.get(name);
    if (!buffers) {
      throw new Error(`SpriteSheet.draw(): Sprite "${name}" not found`);
    }
    context.drawImage(buffers[flip ? 1 : 0], x, y);
  }

  // convenient method to draw a buffer while taking into account tile sizes
  drawTile(name: string, context: CanvasRenderingContext2D, x: number, y: number): void {
    this.draw(name, context, x * this.width, y * this.height);
  }

  drawAnim(name: string, context: CanvasRenderingContext2D, x: number, y: number, distance: number) {
    const animation = this.animations.get(name);
    if (!animation) {
      throw new Error(`Animation not found: ${name}`);
    }
    this.drawTile(animation(distance), context, x, y);
  }

  getAnim(name: string) {
    const anim = this.animations.get(name);
    if (!anim) {
      throw new Error(`Animation not found: ${name}`);
    }
    return anim;
  }
}
