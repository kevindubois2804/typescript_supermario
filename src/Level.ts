import Camera from './Camera';
import { EntityCollection } from './EntityCollection';
import { EntityCollider } from './EntityCollider';
import { GameContext } from './GameContext';
import { clamp, Vec2 } from './math';
import { MusicController } from './MusicController';
import { findPlayers } from './player';
import { Scene } from './Scene';
import { SpriteSheet } from './SpriteSheet';
import { TileCollider } from './TileCollider';

export const OFFSET_PLAYER_FROM_CAMERA = 100;

const MARK: unique symbol = Symbol('level timer earmark');

export class Level extends Scene {
  static EVENT_TRIGGER = Symbol('trigger');
  static EVENT_GOTO_SCENE = Symbol('go to scene event');
  static EVENT_COMPLETE = Symbol('complete');

  [MARK]: boolean | null;

  name = '';

  checkpoints: Vec2[] = [];

  backgroundSprites: SpriteSheet;

  entities = new EntityCollection();
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
      this.entityCollider.check(gameContext, entity);
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
