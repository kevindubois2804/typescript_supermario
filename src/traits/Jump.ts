import { Entity, Side } from '../Entity';
import { GameContext } from '../GameContext';
import { Level } from '../Level';
import { Trait } from '../Trait';
import { InputController } from './InputController';

export class Jump extends Trait {
  duration = 0.3;
  velocity = 200;
  engageTime = 0;
  ready = 0;
  requestTime = 0;
  gracePeriod = 0.1;
  speedBoost = 0.3;

  static TRAIT_ACTIVE = Symbol('jump trait active flag');

  constructor() {
    super();

    this.listen(InputController.KEYBORD_KEY_SPACE_PRESSED, (pressed) => {
      if (pressed) this.start();
      else this.cancel();
    });

    this.listen(Jump.TRAIT_ACTIVE, (flag) => {
      this.isActive = flag;
    });
  }

  start() {
    this.requestTime = this.gracePeriod;
  }

  cancel() {
    this.engageTime = 0;
    this.requestTime = 0;
  }

  update(entity: Entity, { deltaTime }: GameContext, level: Level) {
    if (!this.isActive) return;

    if (this.requestTime > 0) {
      if (this.ready > 0) {
        console.log(level.entities);
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

  obstruct(entity: Entity, side: Side) {
    if (side === Side.bottom) {
      this.ready = 1;
    } else if (side === Side.top) {
      this.cancel();
    }
  }

  get falling() {
    return this.ready < 0;
  }
}
