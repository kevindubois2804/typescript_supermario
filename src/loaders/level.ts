import { EntityFactories } from '../entities';
import { createBackgroundLayer, createSpriteLayer } from '../layers';
import Level, { BackgroundTile, CollisionTile } from '../Level';
import { loadJSON, loadSpriteSheet } from '../loaders';
import { Matrix } from '../math';
import SpriteSheet from '../SpriteSheet';
import { LevelSpec, LevelSpecPatterns, LevelSpecTile, TileRange } from '../types';

export type TileCreatorResult = {
  tile: LevelSpecTile;
  x: number;
  y: number;
};

function setupCollision(levelSpec: LevelSpec, level: Level) {
  const mergedTiles = levelSpec.layers.reduce<LevelSpecTile[]>((mergedTiles, layerSpec) => {
    return mergedTiles.concat(layerSpec.tiles);
  }, []);
  const collisionGrid = createCollisionGrid(mergedTiles, levelSpec.patterns);

  level.setCollisionGrid(collisionGrid);
}

function setupBackgrounds(levelSpec: LevelSpec, level: Level, backgroundSprites: SpriteSheet) {
  levelSpec.layers.forEach((layer) => {
    const backgroundGrid = createBackgroundGrid(layer.tiles, levelSpec.patterns);
    const backgroundLayer = createBackgroundLayer(level, backgroundGrid, backgroundSprites);
    level.comp.layers.push(backgroundLayer);
  });
}

function setupEntities(levelSpec: LevelSpec, level: Level, entityFactories: EntityFactories) {
  levelSpec.entities.forEach(({ name, pos: [x, y] }) => {
    const createEntity = entityFactories[name];
    const entity = createEntity();
    console.log(entity);
    entity.pos.set(x, y);
    level.entities.add(entity);
  });

  const spriteLayer = createSpriteLayer(level.entities);
  level.comp.layers.push(spriteLayer);
}
export function createLevelLoader(entityFactories: EntityFactories) {
  return function loadLevel(name: string) {
    return loadJSON<LevelSpec>(`/levels/${name}.json`)
      .then((levelSpec) => Promise.all([levelSpec, loadSpriteSheet(levelSpec.spriteSheet)]))
      .then(([levelSpec, backgroundSprites]) => {
        const level = new Level();

        setupCollision(levelSpec, level);
        setupBackgrounds(levelSpec, level, backgroundSprites);
        setupEntities(levelSpec, level, entityFactories);

        return level;
      });
  };
}
function createCollisionGrid(tiles: LevelSpecTile[], patterns: LevelSpecPatterns) {
  const grid = new Matrix<CollisionTile>();

  for (const { tile, x, y } of expandTiles(tiles, patterns)) {
    grid.set(x, y, { type: tile.type });
  }

  return grid;
}

function createBackgroundGrid(tiles: LevelSpecTile[], patterns: LevelSpecPatterns) {
  const grid = new Matrix<BackgroundTile>();

  for (const { tile, x, y } of expandTiles(tiles, patterns)) {
    grid.set(x, y, { name: tile.name });
  }

  return grid;
}

function* expandSpan(xStart: number, xLen: number, yStart: number, yLen: number) {
  const xEnd = xStart + xLen;
  const yEnd = yStart + yLen;
  for (let x = xStart; x < xEnd; ++x) {
    for (let y = yStart; y < yEnd; ++y) {
      yield { x, y };
    }
  }
}

//
function expandRange(range: TileRange) {
  if (range.length === 4) {
    const [xStart, xLength, yStart, yLength] = range;
    return expandSpan(xStart, xLength, yStart, yLength);
  } else if (range.length === 3) {
    const [xStart, xLength, yStart] = range;
    return expandSpan(xStart, xLength, yStart, 1);
  } else if (range.length === 2) {
    const [xStart, yStart] = range;
    return expandSpan(xStart, 1, yStart, 1);
  } else {
    throw new Error(`Invalid range of length ${range.length}`);
  }
}

function* expandRanges(ranges: TileRange[]) {
  for (const range of ranges) {
    yield* expandRange(range);
  }
}

function* expandTiles(tiles: LevelSpecTile[], patterns: LevelSpecPatterns) {
  function* walkTiles(tiles: LevelSpecTile[], offsetX: number, offsetY: number): IterableIterator<TileCreatorResult> {
    for (const tile of tiles) {
      for (const { x, y } of expandRanges(tile.ranges)) {
        const derivedX = x + offsetX;
        const derivedY = y + offsetY;

        if (tile.pattern) {
          if (!patterns[tile.pattern]) {
            throw new Error(`pattern ${tile.pattern} not found`);
          }
          const tiles = patterns[tile.pattern].tiles;
          yield* walkTiles(tiles, derivedX, derivedY);
        } else if (tile.name) {
          yield {
            tile,
            x: derivedX,
            y: derivedY,
          };
        } else {
          throw new Error(`Tile does not have a name or a pattern: ${JSON.stringify(tile)}`);
        }
      }
    }
  }

  yield* walkTiles(tiles, 0, 0);
}
