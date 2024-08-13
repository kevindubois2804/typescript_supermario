import { AudioBoard } from './AudioBoard.js';
import BoundingBox from './BoundingBox.js';
import Level from './Level.js';
import { Vec2 } from './math.js';
import { TileResolverMatch } from './TileResolver.js';
import Trait, { TraitConstructor } from './Trait.js';
import { GameContext } from './types.js';

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
  audio?: AudioBoard;
  sounds = new Set<string>();

  draw(context: CanvasRenderingContext2D) {}

  addTrait<T extends Trait>(trait: T) {
    this.traits.push(trait);
    this[trait.NAME] = trait;
  }

  getTrait<T extends Trait>(TraitClass: TraitConstructor<T>): T | undefined {
    for (const trait of this.traits) {
      if (trait instanceof TraitClass) {
        return trait;
      }
    }
    return undefined;
  }

  obstruct(side: Sides, match: TileResolverMatch) {
    this.traits.forEach((trait) => {
      trait.obstruct(this, side, match);
    });
  }

  collides(candidate: Entity) {
    this.traits.forEach((trait) => {
      trait.collides(this, candidate);
    });
  }

  update(gameContext: GameContext, level: Level) {
    this.traits.forEach((trait) => {
      trait.update(this, gameContext, level);
      if (this.audio) this.playSounds(this.audio, gameContext.audioContext);
    });
    this.lifetime += gameContext.deltaTime;
  }

  finalize() {
    this.traits.forEach((trait) => {
      trait.finalize();
    });
  }

  private playSounds(audioBoard: AudioBoard, audioContext: AudioContext) {
    this.sounds.forEach((name) => audioBoard.play(name, audioContext));
    this.sounds.clear();
  }
}
