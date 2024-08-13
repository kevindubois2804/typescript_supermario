import { Entity } from '../Entity';
import Level from '../Level';
import Trait from '../Trait';
import { GameContext } from '../types';

export class Physics extends Trait {
  constructor() {
    super('physics');
  }

  update(entity: Entity, gameContext: GameContext, level: Level) {
    entity.pos.x += entity.vel.x * gameContext.deltaTime;

    level.tileCollider.checkX(entity, gameContext, level);

    entity.pos.y += entity.vel.y * gameContext.deltaTime;
    level.tileCollider.checkY(entity, gameContext, level);

    entity.vel.y += level.gravity * gameContext.deltaTime;
  }
}
