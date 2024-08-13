import { Entity } from '../Entity';
import Trait from '../Trait';
import { GameContext } from '../types';

export class Velocity extends Trait {
  constructor() {
    super('velocity');
  }
  update(entity: Entity, { deltaTime }: GameContext) {
    entity.pos.x += entity.vel.x * deltaTime;
    entity.pos.y += entity.vel.y * deltaTime;
  }
}
