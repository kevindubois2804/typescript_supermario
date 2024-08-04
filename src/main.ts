import Compositor from './Compositor';
import { createBackgroundLayer } from './layers';
import { loadLevel } from './loaders';
import { loadBackgroundSprites, loadMarioSprite } from './sprites';
import SpriteSheet from './SpriteSheet';
import { LayerFunction, Position } from './types';

const canvas = document.getElementById('screen') as HTMLCanvasElement;
const context = canvas.getContext('2d')!;

// high order function that returns a function that will be responsible to draw a buffered canvas on which a sprite is drawn
function createSpriteLayer(sprite: SpriteSheet, pos: Position): LayerFunction {
  return function drawSpriteLayer(context) {
    sprite.draw('idle', context, pos.x, pos.y);
  };
}

// we run our three promises in parallel
Promise.all([loadMarioSprite(), loadBackgroundSprites(), loadLevel('1-1')]).then(([marioSprite, backgroundSprites, level]) => {
  const comp = new Compositor();
  comp.layers.push(createBackgroundLayer(level.backgrounds, backgroundSprites));

  const pos = {
    x: 64,
    y: 64,
  };

  comp.layers.push(createSpriteLayer(marioSprite, pos));

  function update() {
    comp.draw(context);
    pos.x += 2;
    pos.y += 1;
    requestAnimationFrame(update);
  }

  update();
});
