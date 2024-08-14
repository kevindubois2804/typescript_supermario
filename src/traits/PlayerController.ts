import { Entity } from '../Entity';
import Level from '../Level';
import { Vec2 } from '../math';
import { Trait } from '../Trait';
import { GameContext } from '../types';
import { Killable } from './Killable';

export class PlayerController extends Trait {
  player: Entity;
  checkpoint = new Vec2(0, 0);
  time = 300;
  score = 0;

  constructor() {
    super();

    // this.listen('stomp', () => {
    //   this.score += 100;
    // });
  }

  setPlayer(entity: Entity) {
    this.player = entity;
  }

  update(_: Entity, { deltaTime }: GameContext, level: Level) {
    if (!level.entities.has(this.player)) {
      this.player.getTrait(Killable)!.revive();
      this.player.pos.set(this.checkpoint.x, this.checkpoint.y);
      level.entities.add(this.player);
    } else {
      this.time -= deltaTime * 2;
    }
  }
}
