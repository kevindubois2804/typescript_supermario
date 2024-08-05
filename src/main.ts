import { createMario } from './entities';
import setupKeyboard from './input';
import { createCollisionLayer } from './layers';
import { loadLevel } from './loaders';

import Timer from './Timer';

const canvas = document.getElementById('screen') as HTMLCanvasElement;
const context = canvas.getContext('2d')!;

// we run our three promises in parallel
Promise.all([createMario(), loadLevel('1-1')]).then(([mario, level]) => {
  level.comp.layers.push(createCollisionLayer(level));

  level.entities.add(mario);

  mario.pos.set(64, 180);

  const input = setupKeyboard(mario);

  input.listenTo(window);

  // for debugging purposes
  ['mousedown', 'mousemove'].forEach((eventName) => {
    canvas.addEventListener(eventName, (event) => {
      if (event instanceof MouseEvent) {
        if (event.buttons === 1) {
          mario.vel.set(0, 0);
          mario.pos.set(event.offsetX, event.offsetY);
        }
      }
    });
  });

  const timer = new Timer(1 / 60);

  timer.update = function update(deltaTime) {
    level.update(deltaTime);
    level.comp.draw(context);
  };

  timer.start();
});
