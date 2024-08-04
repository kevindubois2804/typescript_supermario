import { Vec2 } from './math.js';
import Trait from './Trait.js';

export class Entity implements Entity {
  [key: string]: any;
  pos: Vec2 = new Vec2();
  vel: Vec2 = new Vec2();
  traits: Trait[] = [];

  draw(context: CanvasRenderingContext2D) {}

  addTrait<T extends Trait>(trait: T) {
    this.traits.push(trait);
    this[trait.NAME] = trait;
  }

  update(deltaTime: number) {
    this.traits.forEach((trait) => {
      trait.update(this, deltaTime);
    });
  }
}
