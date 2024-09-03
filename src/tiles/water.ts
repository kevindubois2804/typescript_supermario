import { TileColliderHandler } from '../TileCollider';
import { Swim } from '../traits/Swim';

const handle: TileColliderHandler = ({ entity, match }) => {
  const swimTrait = entity.getTrait(Swim);
  if (swimTrait && swimTrait.isSwimming !== true) {
    swimTrait.isSwimming = true;
  }
};

export const water = [handle, handle];
