import { Entity, Sides } from '../Entity';
import Trait from '../Trait';

export class PendulumMove extends Trait {
  speed = -30;
  enabled = true;

  constructor() {
    super('pendulumMove');
  }

  update(ent: Entity) {
    if (this.enabled) {
      ent.vel.x = this.speed;
    }
  }

  obstruct(ent: Entity, side: Sides) {
    if (side === Sides.left) {
      this.speed = Math.abs(this.speed);
    } else if (side === Sides.right) {
      this.speed = -Math.abs(this.speed);
    }
  }
}
