import { TraitConstructor } from './Entity';
import { Trait } from './Trait';

export class CollectionTrait extends Trait {
  traits = new Map<Function, Trait>();

  constructor(...traits: Trait[]) {
    super();
    for (let trait of traits) this.addTrait(trait);
  }

  addTrait<T extends Trait>(trait: T) {
    this.traits.set(trait.constructor, trait);
    return trait;
  }

  getTrait<T extends Trait>(TraitClass: TraitConstructor<T>): T | undefined {
    const trait = this.traits.get(TraitClass);
    if (trait instanceof TraitClass) {
      return trait;
    }
  }

  removeTrait<T extends Trait>(TraitClass: TraitConstructor<T>): void {
    if (this.traits.has(TraitClass)) this.traits.delete(TraitClass);
  }

  useTrait<T extends Trait>(TraitClass: TraitConstructor<T>, fn: (trait: T) => void): void {
    const trait = this.getTrait(TraitClass);
    if (trait) fn(trait);
  }
}
