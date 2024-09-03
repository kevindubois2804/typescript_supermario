import { AudioBoard } from './AudioBoard';
import { BoundingBox } from './BoundingBox';
import { CollectionTrait } from './CollectionTrait';
import { EventBuffer } from './EventBuffer';
import { GameContext } from './GameContext';
import { Level } from './Level';
import { Vec2 } from './math';
import { SpriteSheet } from './SpriteSheet';
import { TileResolverMatch } from './TileResolver';
import { Trait } from './Trait';
import { EntityProps } from './types';

export enum Side {
  top,
  bottom,
  left,
  right,
}

export type TraitConstructor<T extends Trait> = new (...args: unknown[]) => T;

export class Entity {
  // audio = new AudioBoard()
  id: number;
  sprite: SpriteSheet;
  audio?: AudioBoard;
  pos = new Vec2();
  vel = new Vec2();
  size = new Vec2();
  offset = new Vec2();
  bounds = new BoundingBox(this.pos, this.size, this.offset);
  traits = new Map<Function, Trait>();
  lifetime = 0;
  sounds = new Set<string>();
  events = new EventBuffer();
  props: EntityProps;

  addTrait<T extends Trait>(trait: T) {
    this.traits.set(trait.constructor, trait);
    return trait;
  }

  getTrait<T extends Trait>(TraitClass: TraitConstructor<T>): T | undefined {
    const trait = this.traits.get(TraitClass);
    if (trait instanceof TraitClass) {
      return trait;
    }

    for (let trait of this.traits.values()) {
      if (trait instanceof CollectionTrait) return trait.getTrait(TraitClass);
    }
  }

  removeTrait<T extends Trait>(TraitClass: TraitConstructor<T>): void {
    if (this.traits.has(TraitClass)) this.traits.delete(TraitClass);

    this.traits.forEach((trait) => {
      if (trait instanceof CollectionTrait) trait.removeTrait(TraitClass);
    });
  }

  useTrait<T extends Trait>(TraitClass: TraitConstructor<T>, fn: (trait: T) => void): void {
    const trait = this.getTrait(TraitClass);
    if (trait) fn(trait);
    if (!trait)
      this.traits.forEach((trait) => {
        if (trait instanceof CollectionTrait) trait.useTrait(TraitClass, fn);
      });
  }

  update(gameContext: GameContext, level: Level) {
    this.traits.forEach((trait) => {
      trait.update(this, gameContext, level);

      if (trait instanceof CollectionTrait) {
        trait.traits.forEach((trait) => trait.update(this, gameContext, level));
      }
    });

    if (this.audio) this.playSounds(this.audio, gameContext.audioContext);

    this.lifetime += gameContext.deltaTime;
  }

  draw(context: CanvasRenderingContext2D) {}

  finalize() {
    this.events.emit(Trait.EVENT_TASK, this);

    this.traits.forEach((trait) => {
      trait.finalize(this);

      if (trait instanceof CollectionTrait) {
        trait.traits.forEach((trait) => trait.finalize(this));
      }
    });

    this.events.clear();
  }

  obstruct(side: Side, match: TileResolverMatch) {
    this.traits.forEach((trait) => {
      trait.obstruct(this, side, match);

      if (trait instanceof CollectionTrait) {
        trait.traits.forEach((trait) => trait.obstruct(this, side, match));
      }
    });
  }

  collides(gameContext: GameContext, candidate: Entity) {
    this.traits.forEach((trait) => {
      trait.collides(gameContext, this, candidate);

      if (trait instanceof CollectionTrait) {
        trait.traits.forEach((trait) => trait.collides(gameContext, this, candidate));
      }
    });
  }

  private playSounds(audioBoard: AudioBoard, audioContext: AudioContext) {
    this.sounds.forEach((name) => audioBoard.play(name, audioContext));
    this.sounds.clear();
  }
}
