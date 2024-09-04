import { Entity } from '../Entity';
import { GameContext } from '../GameContext';
import { Level } from '../Level';
import { Trait } from '../Trait';

type TriggerCondition = (entity: Entity, touches: Set<Entity>, gameContext: GameContext, level: Level) => void;

export class Trigger extends Trait {
  touches = new Set<Entity>();
  conditions: TriggerCondition[] = [];

  static SHOULD_UPDATE: boolean = true;

  collides(_: GameContext, __: Entity, them: Entity) {
    this.touches.add(them);
  }

  update(entity: Entity, gameContext: GameContext, level: Level) {
    if (!Trigger.SHOULD_UPDATE) return;

    if (this.touches.size > 0) {
      for (const condition of this.conditions) {
        condition(entity, this.touches, gameContext, level);
      }
      this.touches.clear();
    }
  }
}
