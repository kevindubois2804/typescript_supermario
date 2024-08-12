import Camera from './Camera';
import { setupMouseControl } from './debug';
import { loadEntities } from './entities';
import { Entity } from './Entity';
import setupKeyboard from './input';
import { createCameraLayer } from './layers/camera';
import { createCollisionLayer } from './layers/collision';
import { createDashboardLayer } from './layers/dashboard';
import { loadFont } from './loaders/font';
import { createLevelLoader } from './loaders/level';
import { PlayerController } from './traits/PlayerController';
import Timer from './Timer';

const canvas = document.getElementById('screen') as HTMLCanvasElement;

function createPlayerEnv(playerEntity: Entity) {
  const playerEnv = new Entity();
  const playerControl = new PlayerController();
  playerControl.checkpoint.set(64, 64);
  playerControl.setPlayer(playerEntity);
  playerEnv.addTrait(playerControl);
  return playerEnv;
}

async function main(canvas: HTMLCanvasElement) {
  const context = canvas.getContext('2d')!;
  const audioContext = new AudioContext();

  const [entityFactories, font] = await Promise.all([loadEntities(audioContext), loadFont()]);

  const loadLevel = createLevelLoader(entityFactories);

  const level = await loadLevel('1-1');

  const camera = new Camera();

  const mario = entityFactories.mario();
  level.entities.add(mario);

  const playerEnv = createPlayerEnv(mario);
  level.entities.add(playerEnv);

  level.comp.layers.push(createCollisionLayer(level), createCameraLayer(camera), createDashboardLayer(font, playerEnv));

  const input = setupKeyboard(mario);
  setupMouseControl(canvas, mario, camera);
  input.listenTo(window);

  const timer = new Timer(1 / 60);
  timer.update = function update(deltaTime) {
    level.update({ deltaTime, audioContext });

    console.log(mario.pos);

    camera.pos.x = Math.max(0, mario.pos.x - 100);

    level.comp.draw(context, camera);
  };

  timer.start();
}

// main(canvas);

const start = () => {
  window.removeEventListener('click', start);
  main(canvas);
};

window.addEventListener('click', start);
