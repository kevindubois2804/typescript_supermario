import { Entity } from '../Entity';
import Trait from '../Trait';

export class Go extends Trait {
  dir: number = 0;
  acceleration: number = 400;
  distance: number = 0;
  heading: number = 1;
  speed: number = 6000;
  dragFactor: number = 1 / 5000;
  deceleration: number = 300;

  constructor() {
    super('go');
  }

  update(entity: Entity, deltaTime: number) {
    const absX = Math.abs(entity.vel.x);

    if (this.dir !== 0) {
      entity.vel.x += this.acceleration * deltaTime * this.dir;

      if (entity.jump) {
        if (entity.jump.falling === false) {
          this.heading = this.dir;
        }
      } else {
        this.heading = this.dir;
      }
    } else if (entity.vel.x !== 0) {
      const decel = Math.min(absX, this.deceleration * deltaTime);
      entity.vel.x += entity.vel.x > 0 ? -decel : decel;
    } else {
      this.distance = 0;
    }

    const drag = this.dragFactor * entity.vel.x * absX;
    entity.vel.x -= drag;

    this.distance += absX * deltaTime;
  }
}
