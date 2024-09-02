import { AnimationManager } from './AnimationManager';
import { AnimationResolver } from './AnimationResolver';
import { raise } from './raise';

export class SpriteSheet {
  tiles = new Map<string, HTMLCanvasElement[]>();
  // animations = new Map<string, AnimationResolver>();
  animationManager = new AnimationManager();

  constructor(public image: HTMLImageElement, public tileWidth: number, public tileHeight: number) {}

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
    this.define(name, x * this.tileWidth, y * this.tileHeight, this.tileWidth, this.tileHeight);
  }

  // defineAnimation(name: string, animation: Animation) {
  //   this.animations.set(name, animation);
  // }

  defineAnimation(name: string, animationResolver: AnimationResolver) {
    this.animationManager.addResolver(name, animationResolver);
  }

  draw(name: string, context: CanvasRenderingContext2D, x: number, y: number, flip = false) {
    const buffers = this.tiles.get(name);
    if (!buffers) {
      throw new Error(`SpriteSheet.draw(): Sprite "${name}" not found`);
    }
    context.drawImage(buffers[flip ? 1 : 0], x, y);
  }

  drawTile(name: string, context: CanvasRenderingContext2D, x: number, y: number) {
    this.draw(name, context, x * this.tileWidth, y * this.tileHeight);
  }

  drawAnimation(name: string, context: CanvasRenderingContext2D, x: number, y: number, distance: number) {
    const animationResolver = this.getAnimationResolver(name);
    this.drawTile(animationResolver.resolveFrame(distance), context, x, y);
  }

  getAnimationResolver(name: string) {
    const animationResolver = this.animationManager.resolvers.get(name);
    if (!animationResolver) {
      throw new Error(`Animation resolver not found: ${name}`);
    }
    return animationResolver;
  }
}
