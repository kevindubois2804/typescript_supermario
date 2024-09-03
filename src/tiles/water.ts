import { TileColliderHandler } from '../TileCollider';
import { Jump } from '../traits/Jump';
import { Swim } from '../traits/Swim';

const handle: TileColliderHandler = ({ entity, match }) => {
  const jumpTrait = entity.getTrait(Jump);
  if (jumpTrait) jumpTrait.velocity = 50;
  const swimTrait = entity.getTrait(Swim);
  if (swimTrait && swimTrait.isSwimming !== true) {
    swimTrait.isSwimming = true;
  }
};

export const water = [handle, handle];
