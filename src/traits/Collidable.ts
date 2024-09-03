import { Entity } from '../Entity';
import { GameContext } from '../GameContext';
import { Level } from '../Level';
import { Trait } from '../Trait';

export class Collidable extends Trait {
  update(entity: Entity, gameContext: GameContext, level: Level) {
    entity.pos.x += entity.vel.x * gameContext.deltaTime;

    level.tileCollider.checkX(entity, gameContext, level);

    entity.pos.y += entity.vel.y * gameContext.deltaTime;
    level.tileCollider.checkY(entity, gameContext, level);
  }
}
