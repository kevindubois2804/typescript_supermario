import { Entity, Sides } from '../Entity';
import { Trait } from '../Trait';
import { GameContext } from '../types';

export default class Jump extends Trait {
  duration: number = 0.3;
  velocity: number = 200;
  engageTime: number = 0;
  ready: number = 0;
  requestTime: number = 0;
  gracePeriod: number = 0.1;
  speedBoost: number = 0.3;

  get falling() {
    return this.ready < 0;
  }

  start() {
    this.requestTime = this.gracePeriod;
  }

  cancel() {
    this.engageTime = 0;
    this.requestTime = 0;
  }

  obstruct(entity: Entity, side: Sides) {
    if (side === Sides.bottom) {
      this.ready = 1;
    } else if (side === Sides.top) {
      this.cancel();
    }
  }

  update(entity: Entity, { deltaTime }: GameContext) {
    if (this.requestTime > 0) {
      if (this.ready > 0) {
        entity.sounds.add('jump');
        this.engageTime = this.duration;
        this.requestTime = 0;
      }
      this.requestTime -= deltaTime;
    }
    if (this.engageTime > 0) {
      entity.vel.y = -(this.velocity + Math.abs(entity.vel.x) * this.speedBoost);
      this.engageTime -= deltaTime;
    }
    this.ready -= 1;
  }
}
