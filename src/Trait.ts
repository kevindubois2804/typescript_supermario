import { Entity, Sides } from './Entity';
import { EventEmitter } from './EventEmitter';
import Level from './Level';
import { TileResolverMatch } from './TileResolver';
import { GameContext } from './types';

export interface TraitConstructor<T extends Trait> {
  new (): T;
}

type TraitTask = (...args: any[]) => void;

export default abstract class Trait {
  events = new EventEmitter();
  NAME: string;
  tasks: TraitTask[] = [];
  constructor(name: string) {
    this.NAME = name;
  }

  update(entity: Entity, gameContext: GameContext, level: Level) {}
  obstruct(entity: Entity, side: Sides, match: TileResolverMatch) {}
  collides(us: Entity, them: Entity) {}
  queue(task: TraitTask) {
    this.tasks.push(task);
  }
  finalize() {
    this.tasks.forEach((task) => task());
    this.tasks.length = 0;
  }
}
