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
    entity.vel.x = this.speed * this.dir * deltaTime;

    if (this.dir) {
      this.heading = this.dir;
      this.distance += Math.abs(entity.vel.x) * deltaTime;
    } else this.distance = 0;
  }
}
