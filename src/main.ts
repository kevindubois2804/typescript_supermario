import Compositor from './Compositor';
import { createMario } from './entities';
import KeyboardState from './KeyboardStates';

import { createBackgroundLayer, createSpriteLayer } from './layers';
import { loadLevel } from './loaders';
import { loadBackgroundSprites } from './sprites';
import Timer from './Timer';

const canvas = document.getElementById('screen') as HTMLCanvasElement;
const context = canvas.getContext('2d')!;

// we run our three promises in parallel
Promise.all([createMario(), loadBackgroundSprites(), loadLevel('1-1')]).then(([mario, backgroundSprites, level]) => {
  const comp = new Compositor();
  comp.layers.push(createBackgroundLayer(level.backgrounds, backgroundSprites));

  const gravity = 2000;
  mario.pos.set(64, 180);

  const input = new KeyboardState();
  input.addMapping('Space', (keyState) => {
    if (keyState) {
      mario.jump.start();
    } else {
      mario.jump.cancel();
    }
  });
  input.listenTo(window);

  const marioSpriteLayer = createSpriteLayer(mario);
  comp.layers.push(marioSpriteLayer);
  const timer = new Timer(1 / 60);

  timer.update = function update(deltaTime) {
    mario.update(deltaTime);
    comp.draw(context);

    mario.vel.y += gravity * deltaTime;
  };

  timer.start();
});

// taking into account how much real time was actually passed between each frame
