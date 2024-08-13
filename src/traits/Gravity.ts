import { Entity } from '../Entity';
import Level from '../Level';
import Trait from '../Trait';
import { GameContext } from '../types';

export class Gravity extends Trait {
  constructor() {
    super('gravity');
  }
  update(entity: Entity, { deltaTime }: GameContext, level: Level) {
    entity.vel.y += level.gravity * deltaTime;
  }
}
