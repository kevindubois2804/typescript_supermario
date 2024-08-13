import { Sides } from '../Entity';
import { TileColliderHandler } from '../TileCollider';

const handleX: TileColliderHandler = ({ entity, match }) => {
  if (entity.vel.x > 0) {
    if (entity.bounds.right > match.x1) {
      entity.obstruct(Sides.right, match);
    }
  } else if (entity.vel.x < 0) {
    if (entity.bounds.left < match.x2) {
      entity.obstruct(Sides.left, match);
    }
  }
};

const handleY: TileColliderHandler = ({ entity, match }) => {
  if (entity.vel.y > 0) {
    if (entity.bounds.bottom > match.y1) {
      entity.obstruct(Sides.bottom, match);
    }
  } else if (entity.vel.y < 0) {
    if (entity.bounds.top < match.y2) {
      entity.obstruct(Sides.top, match);
    }
  }
};

export const ground = [handleX, handleY];
