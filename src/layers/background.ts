// createBackgroundLayer is a high order function that create all the necessary information to create a buffered canvas on which the background is drawn and returns a function that can draw the buffered canvas on the main canvas

import Camera from '../Camera';
import Level, { BackgroundTile } from '../Level';
import { Matrix } from '../math';
import { raise } from '../raise';
import SpriteSheet from '../SpriteSheet';
import { TileResolver } from '../TileResolver';
import { LayerFunction } from '../types';

// the necessary information is taken from the level tiles set
export function createBackgroundLayer(level: Level, tiles: Matrix<BackgroundTile>, sprites: SpriteSheet): LayerFunction {
  const resolver = new TileResolver(tiles);

  // since the backgrounds will be repeatedly drawn on each animation frame, we offload them to an offscreen canvas( buffer )
  const buffer = document.createElement('canvas') as HTMLCanvasElement;
  const bufferContext = buffer.getContext('2d') || raise('Canvas not supported');
  buffer.width = 256 + 16;
  buffer.height = 240;

  // function to redraw the whole screen at a time
  function redraw(startIndex: number, endIndex: number) {
    bufferContext.clearRect(0, 0, buffer.width, buffer.height);
    // we will draw a subset of the tile matrix
    for (let x = startIndex; x <= endIndex; ++x) {
      const col = tiles.grid[x];
      if (col) {
        col.forEach((tile, y) => {
          if (sprites.animations.has(tile.name)) {
            sprites.drawAnim(tile.name, bufferContext, x - startIndex, y, level.totalTime);
          } else {
            sprites.drawTile(tile.name, bufferContext, x - startIndex, y);
          }
        });
      }
    }
  }

  return function drawBackgroundLayer(context: CanvasRenderingContext2D, camera: Camera) {
    // we need to figure out indexes of camera right positions
    // first we get the size
    const drawWidth = resolver.toIndex(camera.size.x);

    // next we get first index
    const drawFrom = resolver.toIndex(camera.pos.x);

    // and the second index
    const drawTo = drawFrom + drawWidth;

    redraw(drawFrom, drawTo);

    context.drawImage(buffer, -camera.pos.x % 16, -camera.pos.y);
  };
}
