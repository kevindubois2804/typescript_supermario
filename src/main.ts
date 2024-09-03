import { setupMouseControlForDebugPurposes } from './debug';
import { loadEntities } from './entities';
import { Entity } from './Entity';
import { GameContext } from './GameContext';
import { setupKeyboard } from './setupkeyboard';
import { createCameraLayer } from './layers/camera';
import { createCollisionLayer } from './layers/collision';
import { createColorLayer } from './layers/color';
import { createDashboardLayer } from './layers/dashboard';
import { createPlayerProgressLayer } from './layers/player-progress';
import { createTextLayer } from './layers/text';
import { Level } from './Level';
import { loadFont } from './loaders/font';
import { createLevelLoader } from './loaders/level';

import { bootstrapPlayer, findPlayers, makePlayer, resetPlayer } from './player';
import { raise } from './raise';
import { Scene } from './Scene';
import { SceneRunner } from './SceneRunner';
import { TimedScene } from './TimedScene';
import { Timer } from './Timer';
import Pipe, { connectEntity } from './traits/Pipe';
import { LevelSpecTrigger } from './types';

async function main(canvas: HTMLCanvasElement) {
  const videoContext = canvas.getContext('2d') || raise('Canvas not supported');
  const audioContext = new AudioContext();

  // turning this off lets us save a lot of Math.floor calls when rendering
  videoContext.imageSmoothingEnabled = false;

  const [entityFactory, font] = await Promise.all([loadEntities(audioContext), loadFont()]);

  const loadLevel = createLevelLoader(entityFactory);

  const sceneRunner = new SceneRunner();

  const mario = entityFactory.mario?.() || raise('where mario tho');
  makePlayer(mario, 'MARIO');

  const { inputRouter, inputHandler } = setupKeyboard(window);
  inputRouter.addReceiver(mario);

  const mouseDebugCameraUpdater = setupMouseControlForDebugPurposes(canvas, mario);

  function createLoadingScreen(name: string) {
    const scene = new Scene();
    scene.comp.layers.push(createColorLayer('#000'));
    scene.comp.layers.push(createTextLayer(font, `Loading ${name}...`));
    return scene;
  }

  async function setupLevel(name: string) {
    const loadingScreen = createLoadingScreen(name);
    sceneRunner.addScene(loadingScreen);
    sceneRunner.runNext();

    const level = await loadLevel(name);
    bootstrapPlayer(mario, level);

    mouseDebugCameraUpdater(level.camera);

    level.events.listen(Level.EVENT_TRIGGER, (spec: LevelSpecTrigger, trigger: Entity, touches: Set<Entity>) => {
      if (spec.type === 'goto') {
        for (const _ of findPlayers(touches)) {
          startWorld(spec.name);
          return;
        }
      }
    });

    level.events.listen(Pipe.EVENT_PIPE_COMPLETE, async (pipe) => {
      if (pipe.props.goesTo) {
        const nextLevel = await setupLevel(pipe.props.goesTo.name);
        sceneRunner.addScene(nextLevel);
        sceneRunner.runNext();
        if (pipe.props.backTo) {
          nextLevel.events.listen(Level.EVENT_COMPLETE, async () => {
            const level = await setupLevel(name);
            const exitPipe = level.entities.get(pipe.props.backTo) as Entity;
            connectEntity(exitPipe, mario);
            sceneRunner.addScene(level);
            sceneRunner.runNext();
          });
        }
      } else {
        level.events.emit(Level.EVENT_COMPLETE);
      }
    });

    level.comp.layers.push(createCollisionLayer(level));
    level.comp.layers.push(createCameraLayer(level.camera));

    const dashboardLayer = createDashboardLayer(font, mario);
    level.comp.layers.push(dashboardLayer);

    return level;
  }

  async function startWorld(name: string) {
    const level = await setupLevel(name);
    resetPlayer(mario, name);

    const playerProgressLayer = createPlayerProgressLayer(font, level);
    const dashboardLayer = createDashboardLayer(font, mario);

    const waitScreen = new TimedScene();
    waitScreen.countDown = 1;
    waitScreen.comp.layers.push(createColorLayer('#000'));
    waitScreen.comp.layers.push(dashboardLayer);
    waitScreen.comp.layers.push(playerProgressLayer);

    sceneRunner.addScene(waitScreen);
    sceneRunner.addScene(level);
    sceneRunner.runNext();
  }

  const gameContext: GameContext = {
    deltaTime: 0,
    audioContext,
    entityFactory,
    videoContext,
    tick: 0,
    inputRouter,
    inputHandler,
  };

  const timer = new Timer(1 / 60);

  timer.update = function update(deltaTime) {
    if (!document.hasFocus()) return;

    gameContext.tick++;
    gameContext.deltaTime = deltaTime;

    sceneRunner.update(gameContext);
  };

  timer.start();
  startWorld('1-1');
}

const canvas = document.getElementById('screen');
if (canvas instanceof HTMLCanvasElement) {
  main(canvas).catch(console.error);
} else {
  console.warn('Canvas not found');
}
