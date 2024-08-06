import { loadImage } from './loaders';
import SpriteSheet from './SpriteSheet';

// export function loadBackgroundSprites(): Promise<SpriteSheet> {
//   return loadImage('/img/tiles.png').then((image) => {
//     const sprites = new SpriteSheet(image, 16, 16);
//     sprites.defineTile('ground', 0, 0);
//     sprites.defineTile('sky', 3, 23);
//     return sprites;
//   });
// }

export function loadMarioSprite(): Promise<SpriteSheet> {
  return loadImage('/img/characters.gif').then((image) => {
    const mario = new SpriteSheet(image, 16, 16);
    mario.define('idle', 276, 44, 16, 16);
    return mario;
  });
}
