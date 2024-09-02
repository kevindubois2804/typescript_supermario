import { Entity } from './Entity';
import { GameContext } from './GameContext';

export class EntityCollider {
  constructor(public entities: Set<Entity>) {}

  check(gameContext: GameContext, subject: Entity) {
    for (const candidate of this.entities) {
      if (subject === candidate) continue;

      if (subject.bounds.overlaps(candidate.bounds)) {
        subject.collides(gameContext, candidate);
      }
    }
  }
}
