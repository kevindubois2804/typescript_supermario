import { loadImage, loadLevel } from './loaders';
import SpriteSheet from './SpriteSheet';
import { LevelBackgroundData } from './types';

function drawBackground(background: LevelBackgroundData, context: CanvasRenderingContext2D, sprites: SpriteSheet) {
  // on the background we loop over all ranges
  background.ranges.forEach(([x1, x2, y1, y2]: number[]) => {
    for (let x = x1; x < x2; ++x) {
      for (let y = y1; y < y2; ++y) {
        sprites.drawTile(background.tile, context, x, y);
      }
    }
  });
}

const canvas = document.getElementById('screen') as HTMLCanvasElement;
const context = canvas.getContext('2d')!;

loadImage('/img/tiles.png').then((image) => {
  const sprites = new SpriteSheet(image, 16, 16);
  sprites.define('ground', 0, 0);
  sprites.define('sky', 3, 23);

  // load level after we laoded the sprites
  loadLevel('1-1').then((level) => {
    // drawing the backgrounds
    level.backgrounds.forEach((bg) => {
      drawBackground(bg, context, sprites);
    });
  });
});
