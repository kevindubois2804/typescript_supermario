import { Vec2 } from './math.js';
import Trait from './Trait.js';

export enum Sides {
  top,
  bottom,
  left,
  right,
}

export class Entity implements Entity {
  [key: string]: any;
  pos: Vec2 = new Vec2();
  vel: Vec2 = new Vec2();
  size: Vec2 = new Vec2();
  traits: Trait[] = [];

  draw(context: CanvasRenderingContext2D) {}

  addTrait<T extends Trait>(trait: T) {
    this.traits.push(trait);
    this[trait.NAME] = trait;
  }

  obstruct(side: Sides) {
    this.traits.forEach((trait) => {
      trait.obstruct(this, side);
    });
  }

  update(deltaTime: number) {
    this.traits.forEach((trait) => {
      trait.update(this, deltaTime);
    });
  }
}
