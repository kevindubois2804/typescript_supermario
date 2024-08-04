import { Entity } from '../Entity.js';
import Trait from '../Trait.js';

export default class Velocity extends Trait {
  constructor() {
    super('velocity');
  }

  update(entity: Entity, deltaTime: number) {
    entity.pos.x += entity.vel.x * deltaTime;
    entity.pos.y += entity.vel.y * deltaTime;
  }
}
