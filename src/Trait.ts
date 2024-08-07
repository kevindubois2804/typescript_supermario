import { Entity, Sides } from './Entity';
import Level from './Level';

export interface TraitConstructor<T extends Trait> {
  new (): T;
}

export default abstract class Trait {
  NAME: string;
  constructor(name: string) {
    this.NAME = name;
  }

  update(entity: Entity, deltaTime: number, level?: Level) {}
  obstruct(entity: Entity, side: Sides) {}
  collides(us: Entity, them: Entity) {}
}
