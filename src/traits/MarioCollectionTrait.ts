import { CollectionTrait } from '../CollectionTrait';
import { Trait } from '../Trait';

export class MarioCollectionTrait extends CollectionTrait {
  constructor(...traits: Trait[]) {
    super(...traits);

    console.log(this.traits);
  }
}
