import Camera from '../Camera';
import { Level } from '../Level';
import { Vec2 } from '../math';
import { raise } from '../raise';
import { SpriteSheet } from '../SpriteSheet';
import { TileResolver, TileResolverMatrix } from '../TileResolver';

// export function createBackgroundLayer(level: Level, tiles: TileResolverMatrix, sprites: SpriteSheet) {
//   const tileResolver = new TileResolver(tiles);

//   const buffer = document.createElement('canvas');
//   buffer.width = 256 + 16;
//   buffer.height = 240 + 16;

//   const bufferContext = buffer.getContext('2d') || raise('Canvas not supported');

//   function drawTiles(startIndex: number, endIndex: number) {
//     bufferContext.clearRect(0, 0, buffer.width, buffer.height);

//     const items = tiles.itemsInRange(startIndex, 0, endIndex, buffer.height / 16);
//     // iterate over the tiles instead of accessing the grid
//     for (const [tile, x, y] of items) {
//       if (!tile.style) continue;
//       if (sprites.animationManager.resolvers.has(tile.style)) {
//         sprites.drawAnimation(tile.style, bufferContext, x - startIndex, y, level.totalTime);
//       } else {
//         sprites.drawTile(tile.style, bufferContext, x - startIndex, y);
//       }
//     }
//   }

//   return function drawBackgroundLayer(context: CanvasRenderingContext2D, camera: Camera) {
//     const drawWidth = tileResolver.toIndex(camera.size.x);
//     const drawFrom = tileResolver.toIndex(camera.pos.x);
//     // console.log('camero position x : ', camera.pos.x);
//     // console.log('minus camero position x : ', -camera.pos.x % 16);
//     const drawTo = drawFrom + drawWidth;
//     drawTiles(drawFrom, drawTo);

//     context.drawImage(buffer, -camera.pos.x % 16, -camera.pos.y % 16);
//   };
// }

export function createBackgroundLayer(level: Level, tiles: TileResolverMatrix, sprites: SpriteSheet) {
  const tileResolver = new TileResolver(tiles);

  const buffer = document.createElement('canvas');
  buffer.width = 256 + 16;
  buffer.height = 240 + 16;

  let drawFrom: Vec2 = new Vec2();
  let drawTo: Vec2 = new Vec2();
  let startIndex: Vec2 = new Vec2();
  let endIndex: Vec2 = new Vec2();
  let drawWidth: Vec2 = new Vec2();

  let shouldNotRedrawFlag: boolean;

  const bufferContext = buffer.getContext('2d') || raise('Canvas not supported');

  function drawTiles(drawFrom: Vec2, drawTo: Vec2) {
    if (shouldNotRedrawFlag && drawFrom.x === startIndex.x && drawTo.x && drawTo.x === endIndex.x && drawFrom.y === startIndex.y && drawTo.y === endIndex.y) {
      return;
    }

    console.log('redrawing');

    startIndex.x = drawFrom.x;
    startIndex.y = drawFrom.y;
    endIndex.x = drawTo.x;
    endIndex.y = drawTo.y;

    bufferContext.clearRect(0, 0, buffer.width, buffer.height);

    const items = tiles.itemsInRange(startIndex.x, startIndex.y, endIndex.x, endIndex.y);

    shouldNotRedrawFlag = true;

    // iterate over the tiles instead of accessing the grid
    for (const [tile, x, y] of items) {
      if (!tile.style) continue;
      if (tile.animated === true) shouldNotRedrawFlag = false;
      if (sprites.animationManager.resolvers.has(tile.style)) {
        sprites.drawAnimation(tile.style, bufferContext, x - startIndex.x, y - startIndex.y, level.totalTime);
      } else {
        sprites.drawTile(tile.style, bufferContext, x - startIndex.x, y - startIndex.y);
      }
    }
  }

  return function drawBackgroundLayer(context: CanvasRenderingContext2D, camera: Camera) {
    drawWidth.x = tileResolver.toIndex(camera.size.x);
    drawWidth.y = tileResolver.toIndex(camera.size.y);
    drawFrom.x = tileResolver.toIndex(camera.pos.x);
    drawFrom.y = tileResolver.toIndex(camera.pos.y);

    drawTo.x = drawFrom.x + drawWidth.x;
    drawTo.y = drawFrom.y + drawWidth.y;
    drawTiles(drawFrom, drawTo);

    context.drawImage(buffer, -camera.pos.x % 16, -camera.pos.y % 16);
  };
}
