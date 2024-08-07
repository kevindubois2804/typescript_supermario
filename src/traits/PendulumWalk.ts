import { Entity, Sides } from '../Entity';
import Trait from '../Trait';

export default class PendulumWalk extends Trait {
  speed: number = -30;

  constructor() {
    super('pendulumWalk');
  }

  obstruct(entity: Entity, side: Sides) {
    if (side === Sides.left || side === Sides.right) {
      this.speed = -this.speed;
    }
  }

  update(entity: Entity, deltaTime: number) {
    entity.vel.x = this.speed;
  }
}
