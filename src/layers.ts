import { raise } from './raise';
import SpriteSheet from './SpriteSheet';
import { LayerFunction, LevelBackgroundData } from './types';

export function drawBackground(background: LevelBackgroundData, context: CanvasRenderingContext2D, sprites: SpriteSheet) {
  // on the background we loop over all ranges
  background.ranges.forEach(([x1, x2, y1, y2]: number[]) => {
    for (let x = x1; x < x2; ++x) {
      for (let y = y1; y < y2; ++y) {
        sprites.drawTile(background.tile, context, x, y);
      }
    }
  });
}

// createBackgroundLayer is a high order function that create all the necessary information to create a buffered canvas on which the background is drawn and returns a function that can draw the buffered canvas on the main canvas
export function createBackgroundLayer(backgrounds: LevelBackgroundData[], sprites: SpriteSheet): LayerFunction {
  // since the backgrounds will be repeatedly drawn on each animation frame, we offload them to an offscreen canvas( buffer )
  const buffer = document.createElement('canvas') as HTMLCanvasElement;
  const bufferContext = buffer.getContext('2d') || raise('Canvas not supported');
  buffer.width = 256;
  buffer.height = 240;

  backgrounds.forEach((background) => {
    drawBackground(background, bufferContext, sprites);
  });

  return function drawBackgroundLayer(context: CanvasRenderingContext2D) {
    context.drawImage(buffer, 0, 0);
  };
}
