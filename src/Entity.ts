import BoundingBox from './BoundingBox.js';
import Level from './Level.js';
import { Vec2 } from './math.js';
import Trait, { TraitConstructor } from './Trait.js';

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
  canCollide: boolean = true;

  draw(context: CanvasRenderingContext2D) {}

  addTrait<T extends Trait>(trait: T) {
    this.traits.push(trait);
    this[trait.NAME] = trait;
  }

  getTrait<T extends Trait>(TraitClass: TraitConstructor<T>): T | null {
    const trait = this.traits.find((trait) => trait instanceof TraitClass);
    return trait as T | null;
  }

  obstruct(side: Sides) {
    this.traits.forEach((trait) => {
      trait.obstruct(this, side);
    });
  }

  collides(candidate: Entity) {
    this.traits.forEach((trait) => {
      trait.collides(this, candidate);
    });
  }

  update(deltaTime: number, level: Level) {
    this.traits.forEach((trait) => {
      trait.update(this, deltaTime, level);
    });

    this.lifetime += deltaTime;
  }
}
