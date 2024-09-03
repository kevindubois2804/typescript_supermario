import { Entity, Side, TraitConstructor } from './Entity';
import { GameContext } from './GameContext';
import { Level } from './Level';
import { TileResolverMatch } from './TileResolver';

type TraitTask = (...args: any[]) => void;

type TraitListener = {
  name: string | symbol;
  callback: () => void;
  count: number;
};

export abstract class Trait {
  static EVENT_TASK = Symbol('task');

  isActive: boolean = true;

  constructor() {}

  flag: boolean;

  private listeners: TraitListener[] = [];
  // @ts-ignore
  protected observers: TraitConstructor<T>[] = [];

  protected listen(name: string | symbol, callback: (...args: any[]) => void, count = Infinity) {
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
  obstruct(entity: Entity, side: Side, match: TileResolverMatch) {}
  collides(gameContext: GameContext, us: Entity, them: Entity) {}

  // observe<T extends Trait>(entity: Entity, ...TraitsClasses: TraitConstructor<T>[]) {
  //   for (let TraitClass of TraitsClasses) {
  //     const trait = entity.getTrait(TraitClass) as Trait;
  //     if (!trait) {
  //       continue;
  //     } else {
  //       // @ts-ignore
  //       entity.events.emit(TraitClass.TRAIT_ACTIVE, this.flag);
  //     }
  //   }
  // }

  observe(entity: Entity) {
    for (let TraitClass of this.observers) {
      const trait = entity.getTrait(TraitClass) as Trait;
      if (!trait) {
        continue;
      } else {
        // @ts-ignore
        entity.events.emit(TraitClass.TRAIT_ACTIVE, !this.flag);
      }
    }
  }

  addObserver<T extends Trait>(TraitClass: TraitConstructor<T>) {
    this.observers.push(TraitClass);
  }

  removeObserver<T extends Trait>(TraitClass: TraitConstructor<T>) {
    this.observers.filter((observer) => observer !== TraitClass);
  }
}
