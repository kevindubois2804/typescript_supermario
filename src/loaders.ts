import { createBackgroundLayer, createSpriteLayer } from './layers';
import Level from './Level';
import { LevelBackgroundData, LevelData } from './types';
import { loadBackgroundSprites } from './sprites';

export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const image = new Image();
    image.addEventListener('load', () => {
      resolve(image);
    });
    image.src = url;
  });
}

export function loadLevel(name: string): Promise<Level> {
  return Promise.all([loadBackgroundSprites(), loadJSON<LevelData>(`/levels/${name}.json`)]).then(([backgroundSprites, levelSpec]) => {
    const level = new Level();

    createTiles(level, levelSpec.backgrounds);

    const backgroundLayer = createBackgroundLayer(level, backgroundSprites);
    level.comp.layers.push(backgroundLayer);

    const marioSpriteLayer = createSpriteLayer(level.entities);
    level.comp.layers.push(marioSpriteLayer);

    return level;
  });
}

export function loadJSON<T>(url: string): Promise<T> {
  return fetch(url).then((res) => res.json());
}

function createTiles(level: Level, backgrounds: LevelBackgroundData[]) {
  // we loop over the backgrounds data
  backgrounds.forEach((background) => {
    background.ranges.forEach(([x1, x2, y1, y2]: number[]) => {
      // we extrapolate which coordinates we have
      for (let x = x1; x < x2; ++x) {
        for (let y = y1; y < y2; ++y) {
          // we set the relevant data about the tile on the respective coord in the matrix
          level.tiles.set(x, y, {
            name: background.tile,
          });
        }
      }
    });
  });
}
