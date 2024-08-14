import { Entity, Sides } from './Entity';
import Level from './Level';
import { TileResolverMatch } from './TileResolver';
import { GameContext } from './types';

export type TraitConstructor<T extends Trait> = new (...args: any[]) => T;

type TraitTask = () => void;

type TraitListener = {
  name: string | symbol;
  callback: () => void;
  count: number;
};

export abstract class Trait {
  static EVENT_TASK = Symbol('task');

  private listeners: TraitListener[] = [];

  protected listen(name: string | symbol, callback: () => void, count = Infinity) {
    this.listeners.push({ name, callback, count });
  }

  queue(task: TraitTask) {
    this.listen(Trait.EVENT_TASK, task, 1);
  }

  finalize(entity: Entity) {
    for (const listener of this.listeners) {
      entity.events.process(listener.name, listener.callback);
      listener.count -= 1;
    }

    this.listeners = this.listeners.filter((listener) => listener.count > 0);
  }

  update(entity: Entity, gameContext: GameContext, level: Level) {}
  obstruct(entity: Entity, side: Sides, match: TileResolverMatch) {}
  collides(us: Entity, them: Entity) {}
}
