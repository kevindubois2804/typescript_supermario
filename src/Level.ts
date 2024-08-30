import Camera from './Camera';
import { Entity } from './Entity';
import { EntityCollider } from './EntityCollider';
import { GameContext } from './GameContext';
import { clamp, Vec2 } from './math';
import { MusicController } from './MusicController';
import { findPlayers } from './player';
import { Scene } from './Scene';
import { TileCollider } from './TileCollider';

const OFFSET_PLAYER_FROM_CAMERA = 100;

const MARK: unique symbol = Symbol('level timer earmark');

export class Level extends Scene {
  static EVENT_TRIGGER = Symbol('trigger');
  static EVENT_GOTO_SCENE = Symbol('go to scene event');

  [MARK]: boolean | null;

  name = '';

  checkpoints: Vec2[] = [];

  entities = new Set<Entity>();
  entityCollider = new EntityCollider(this.entities);
  tileCollider = new TileCollider();
  music = new MusicController();
  camera = new Camera();

  gravity = 1500;
  totalTime = 0;

  update(gameContext: GameContext) {
    this.entities.forEach((entity) => {
      entity.update(gameContext, this);
    });

    this.entities.forEach((entity) => {
      this.entityCollider.check(entity);
    });

    this.entities.forEach((entity) => {
      entity.finalize();
    });

    this.totalTime += gameContext.deltaTime;

    focusPlayer(this);
  }

  draw(gameContext: GameContext) {
    this.comp.draw(gameContext.videoContext, this.camera);
  }

  pause() {
    this.music.pause();
  }

  getMarkSymbol(): boolean | null {
    return this[MARK];
  }

  setMarkSymbol(value: boolean) {
    this[MARK] = value;
  }
}

function focusPlayer(level: Level) {
  for (const player of findPlayers(level.entities)) {
    level.camera.pos.x = clamp(player.pos.x - OFFSET_PLAYER_FROM_CAMERA, level.camera.min.x, level.camera.max.x - level.camera.size.x);
  }
}
