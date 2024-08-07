import Camera from './Camera';
import { setupMouseControl } from './debug';
import { loadEntities } from './entities';
import setupKeyboard from './input';
import { createCameraLayer, createCollisionLayer } from './layers';
import { loadLevel } from './loaders/level';
import Timer from './Timer';

const canvas = document.getElementById('screen') as HTMLCanvasElement;
const context = canvas.getContext('2d')!;

// we run our three promises in parallel

Promise.all([loadEntities(), loadLevel('1-1')]).then(([factories, level]) => {
  const camera = new Camera();

  const mario = factories.mario();
  mario.pos.set(64, 64);

  const goomba = factories.goomba();
  goomba.pos.x = 220;
  level.entities.add(goomba);

  const koopa = factories.koopa();
  koopa.pos.x = 260;
  level.entities.add(koopa);

  level.entities.add(mario);
  level.comp.layers.push(createCollisionLayer(level), createCameraLayer(camera));
  const input = setupKeyboard(mario);

  input.listenTo(window);

  setupMouseControl(canvas, mario, camera);

  const timer = new Timer(1 / 60);

  timer.update = function update(deltaTime) {
    level.update(deltaTime);

    if (mario.pos.x > 100) {
      camera.pos.x = mario.pos.x - 100;
    }

    level.comp.draw(context, camera);
  };

  timer.start();
});

// visualizing tiles
// context.strokeStyle = 'yellow';
// context.beginPath();
// context.rect(2 * 16, 11 * 16, 16, 16);
// context.stroke();
