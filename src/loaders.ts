import { createBackgroundLayer, createSpriteLayer } from './layers';
import Level from './Level';
import { BackgroundSpec, LevelSpec, SpriteSheetSpec } from './types';
import SpriteSheet from './SpriteSheet';
import { createAnim } from './animation';

export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const image = new Image();
    image.addEventListener('load', () => {
      resolve(image);
    });
    image.src = url;
  });
}

export function loadSpriteSheet(name: string): Promise<SpriteSheet> {
  return loadJSON<SpriteSheetSpec>(`/sprites/${name}.json`)
    .then((sheetSpec) => Promise.all([sheetSpec, loadImage(sheetSpec.imageURL)]))
    .then(([sheetSpec, image]) => {
      const sprites = new SpriteSheet(image, sheetSpec.tileW, sheetSpec.tileH);

      if (sheetSpec.tiles)
        sheetSpec.tiles.forEach((tileSpec) => {
          sprites.defineTile(tileSpec.name, tileSpec.index[0], tileSpec.index[1]);
        });

      if (sheetSpec.frames)
        sheetSpec.frames.forEach((frameSpec) => {
          sprites.define(frameSpec.name, ...frameSpec.rect);
        });

      if (sheetSpec.animations) {
        sheetSpec.animations.forEach((animSpec) => {
          const animation = createAnim(animSpec.frames, animSpec.frameLen);
          sprites.defineAnim(animSpec.name, animation);
        });
      }

      return sprites;
    });
}

export function loadLevel(name: string): Promise<Level> {
  return loadJSON<LevelSpec>(`/levels/${name}.json`)
    .then((levelSpec) => Promise.all([levelSpec, loadSpriteSheet(levelSpec.spriteSheet)]))
    .then(([levelSpec, backgroundSprites]) => {
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

function createTiles(level: Level, backgrounds: BackgroundSpec[]) {
  function applyRange(background: BackgroundSpec, xStart: number, xLen: number, yStart: number, yLen: number) {
    const xEnd = xStart + xLen;
    const yEnd = yStart + yLen;
    for (let x = xStart; x < xEnd; ++x) {
      for (let y = yStart; y < yEnd; ++y) {
        level.tiles.set(x, y, {
          name: background.tile,
          type: background.type,
        });
      }
    }
  }

  backgrounds.forEach((background) => {
    background.ranges.forEach((range) => {
      if (range.length === 4) {
        const [xStart, xLen, yStart, yLen] = range;
        applyRange(background, xStart, xLen, yStart, yLen);
      } else if (range.length === 3) {
        const [xStart, xLen, yStart] = range;
        applyRange(background, xStart, xLen, yStart, 1);
      } else if (range.length === 2) {
        const [xStart, yStart] = range;
        applyRange(background, xStart, 1, yStart, 1);
      }
    });
  });
}
