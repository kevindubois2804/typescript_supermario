import { Entity } from '../Entity';
import { GameContext } from '../GameContext';
import { Trait } from '../Trait';
import { InputController } from './InputController';
import { Jump } from './Jump';

export class Go extends Trait {
  dir = 0;
  acceleration = 400;
  distance = 0;
  heading = 1;
  dragFactor = 1 / 5000;
  deceleration = 300;

  static TRAIT_ACTIVE = Symbol('go trait active flag');

  constructor() {
    super();
    this.listen(InputController.KEYBORD_KEY_RIGHT_PRESSED, (leftState, rightState) => {
      if (!this.isActive) return;
      this.dir = rightState - leftState;
    });
    this.listen(InputController.KEYBORD_KEY_LEFT_PRESSED, (leftState, rightState) => {
      if (!this.isActive) return;
      this.dir = rightState - leftState;
    });
  }

  update(entity: Entity, { deltaTime }: GameContext) {
    const absX = Math.abs(entity.vel.x);

    if (this.dir !== 0) {
      entity.vel.x += this.acceleration * this.dir * deltaTime;

      const jump = entity.getTrait(Jump);
      if (jump) {
        if (jump.falling === false) {
          this.heading = this.dir;
        }
      } else {
        this.heading = this.dir;
      }
    } else if (entity.vel.x !== 0) {
      const decel = Math.min(absX, this.deceleration * deltaTime);
      entity.vel.x += -Math.sign(entity.vel.x) * decel;
    } else {
      this.distance = 0;
    }
    const drag = this.dragFactor * entity.vel.x * absX;
    entity.vel.x -= drag;

    this.distance += absX * deltaTime;
  }
}
