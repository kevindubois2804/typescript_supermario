import { Entity } from '../Entity';
import { GameContext } from '../GameContext';
import { Level } from '../Level';
import { Trait } from '../Trait';

export class Gravity extends Trait {
  static TRAIT_ACTIVE = Symbol('gravity trait active flag');

  constructor() {
    super();
    this.listen(Gravity.TRAIT_ACTIVE, (flag) => {
      this.isActive = flag;
    });
  }
  update(entity: Entity, { deltaTime }: GameContext, level: Level) {
    if (!this.isActive) return;
    entity.vel.y += level.gravity * deltaTime;
  }
}
