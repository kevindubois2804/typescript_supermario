import Camera from './Camera';
import { Entity } from './Entity';
import Level, { BackgroundTile } from './Level';
import { Matrix } from './math';
import { raise } from './raise';
import SpriteSheet from './SpriteSheet';
import { TileResolver } from './TileResolver';
import { LayerFunction } from './types';

// createBackgroundLayer is a high order function that create all the necessary information to create a buffered canvas on which the background is drawn and returns a function that can draw the buffered canvas on the main canvas
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
    console.log(tiles);
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

// high order function that returns a function that will be responsible to draw a buffered canvas on which a sprite is drawn
export function createSpriteLayer(entities: Set<Entity>, width: number = 64, height: number = 64): LayerFunction {
  const spriteBuffer = document.createElement('canvas') as HTMLCanvasElement;
  spriteBuffer.width = width;
  spriteBuffer.height = height;

  const spriteBufferContext = spriteBuffer.getContext('2d') || raise('Canvas not supported');

  return function drawSpriteLayer(context: CanvasRenderingContext2D, camera: Camera) {
    entities.forEach((entity) => {
      spriteBufferContext.clearRect(0, 0, width, height);
      entity.draw(spriteBufferContext);
      context.drawImage(spriteBuffer, entity.pos.x - camera.pos.x, entity.pos.y - camera.pos.y);
    });
  };
}

// keeps track of the matches from th tile resolver we get out as we move mario around; for debugging purposes
export function createCollisionLayer(level: Level): LayerFunction {
  // where the resolved tiles are stored for later drawing them on canvas
  const resolvedTiles = [] as Array<{ x: number; y: number }>;

  // we get the tile resolver
  // if (!level.tileCollider) return;
  const tileResolver = level.tileCollider.tiles;

  // we get the tile size
  const tileSize = tileResolver.tileSize;

  // create a reference to the original getByIndex function
  const getByIndexOriginal = tileResolver.getByIndex;

  // we override the getByIndex method of the tile resolver instance
  tileResolver.getByIndex = function getByIndexFake(x, y) {
    // we store the values of tile indexes
    resolvedTiles.push({ x, y });
    return getByIndexOriginal.call(tileResolver, x, y);
  };

  return function drawCollision(context: CanvasRenderingContext2D, camera: Camera) {
    context.strokeStyle = 'blue';
    // we iterate over the resolved tiles
    resolvedTiles.forEach(({ x, y }) => {
      context.beginPath();
      context.rect(x * tileSize - camera.pos.x, y * tileSize - camera.pos.y, tileSize, tileSize);
      context.stroke();
    });

    context.strokeStyle = 'red';
    level.entities.forEach((entity) => {
      context.beginPath();
      context.rect(entity.pos.x - camera.pos.x, entity.pos.y - camera.pos.y, entity.size.x, entity.size.y);
      context.stroke();
    });

    //once we have drawn everything we empty the resolved tiles array
    resolvedTiles.length = 0;
  };
}

// we can send in the same camera or draw another camera from another camera perspective
export function createCameraLayer(cameraToDraw: Camera) {
  return function drawCameraRect(context: CanvasRenderingContext2D, fromCamera: Camera) {
    context.strokeStyle = 'purple';
    context.beginPath();
    context.rect(cameraToDraw.pos.x - fromCamera.pos.x, cameraToDraw.pos.y - fromCamera.pos.y, cameraToDraw.size.x, cameraToDraw.size.y);
    context.stroke();
  };
}
