import { TileColliderHandler } from '../TileCollider';
import { Swim } from '../traits/Swim';

const handle: TileColliderHandler = ({ entity, match }) => {
  if (entity.getTrait(Swim)) entity.getTrait(Swim)!.isSwimming = false;
};

export const sky = [handle, handle];
