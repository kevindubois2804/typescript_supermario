import { Entity } from './Entity';
import Level from './Level';
import { raise } from './raise';
import SpriteSheet from './SpriteSheet';
import { LayerFunction } from './types';

// createBackgroundLayer is a high order function that create all the necessary information to create a buffered canvas on which the background is drawn and returns a function that can draw the buffered canvas on the main canvas
// the necessary information is taken from the level tiles set
export function createBackgroundLayer(level: Level, sprites: SpriteSheet): LayerFunction {
  // since the backgrounds will be repeatedly drawn on each animation frame, we offload them to an offscreen canvas( buffer )
  const buffer = document.createElement('canvas') as HTMLCanvasElement;
  const bufferContext = buffer.getContext('2d') || raise('Canvas not supported');
  buffer.width = 256;
  buffer.height = 240;

  level.tiles.forEach((tile, x, y) => {
    sprites.drawTile(tile.name, bufferContext, x, y);
  });

  return function drawBackgroundLayer(context: CanvasRenderingContext2D) {
    context.drawImage(buffer, 0, 0);
  };
}

// high order function that returns a function that will be responsible to draw a buffered canvas on which a sprite is drawn
export function createSpriteLayer(entities: Set<Entity>): LayerFunction {
  return function drawSpriteLayer(context) {
    entities.forEach((entity) => entity.draw(context));
  };
}

// keeps track of the matches from th tile resolver we get out as we move mario around; for debugging purposes
export function createCollisionLayer(level: Level) {
  // where the resolved tiles are stored for later drawing them on canvas
  const resolvedTiles = [] as Array<{ x: number; y: number }>;

  // we get the tile resolver
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

  return function drawCollision(context: CanvasRenderingContext2D) {
    context.strokeStyle = 'blue';
    // we iterate over the resolved tiles
    resolvedTiles.forEach(({ x, y }) => {
      context.beginPath();
      context.rect(x * tileSize, y * tileSize, tileSize, tileSize);
      context.stroke();
    });

    context.strokeStyle = 'red';
    level.entities.forEach((entity) => {
      context.beginPath();
      context.rect(entity.pos.x, entity.pos.y, entity.size.x, entity.size.y);
      context.stroke();
    });

    //once we have drawn everything we empty the resolved tiles array
    resolvedTiles.length = 0;
  };
}
