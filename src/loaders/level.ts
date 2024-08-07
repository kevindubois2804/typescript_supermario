import { createBackgroundLayer, createSpriteLayer } from '../layers';
import Level, { BackgroundTile, CollisionTile } from '../Level';
import { loadJSON, loadSpriteSheet } from '../loaders';
import { Matrix } from '../math';
import { LevelSpec, LevelSpecPatterns, LevelSpecTile, TileCreatorResult, TileRange } from '../types';

export function loadLevel(name: string): Promise<Level> {
  return loadJSON<LevelSpec>(`/levels/${name}.json`)
    .then((levelSpec) => Promise.all([levelSpec, loadSpriteSheet(levelSpec.spriteSheet)]))
    .then(([levelSpec, backgroundSprites]) => {
      const level = new Level();
      const mergedTiles = levelSpec.layers.reduce<LevelSpecTile[]>((mergedTiles, layerSpec) => {
        return mergedTiles.concat(layerSpec.tiles);
      }, []);
      const collisionGrid = createCollisionGrid(mergedTiles, levelSpec.patterns);

      level.setCollisionGrid(collisionGrid);

      levelSpec.layers.forEach((layer) => {
        const backgroundGrid = createBackgroundGrid(layer.tiles, levelSpec.patterns);
        const backgroundLayer = createBackgroundLayer(level, backgroundGrid, backgroundSprites);
        level.comp.layers.push(backgroundLayer);
      });

      const spriteLayer = createSpriteLayer(level.entities);
      level.comp.layers.push(spriteLayer);

      return level;
    });
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

function expandTiles(tiles: LevelSpecTile[], patterns: LevelSpecPatterns) {
  // collect all tiles
  const expandedTiles = [] as TileCreatorResult[];

  function walkTiles(tiles: LevelSpecTile[], offsetX: number, offsetY: number) {
    for (const tile of tiles) {
      for (const { x, y } of expandRanges(tile.ranges)) {
        const derivedX = x + offsetX;
        const derivedY = y + offsetY;

        if (tile.pattern) {
          const tiles = patterns[tile.pattern].tiles;
          walkTiles(tiles, derivedX, derivedY);
        } else {
          expandedTiles.push({
            tile,
            x: derivedX,
            y: derivedY,
          });
        }
      }
    }
  }

  walkTiles(tiles, 0, 0);

  return expandedTiles;
}
