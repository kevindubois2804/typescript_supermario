import BoundingBox from './BoundingBox.js';
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
  offset: Vec2 = new Vec2(0, 0);
  lifetime: number = 0;
  bounds = new BoundingBox(this.pos, this.size, this.offset);
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

    this.lifetime += deltaTime;
  }
}
