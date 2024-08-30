import { Entity, Side } from '../Entity';
import { GameContext } from '../GameContext';
import { Level } from '../Level';
import { Vec2 } from '../math';
import { TileColliderHandler } from '../TileCollider';
import { TileResolverMatch } from '../TileResolver';
import Player from '../traits/Player';

function centerEntity(entity: Entity, pos: Vec2) {
  entity.pos.x = pos.x - entity.size.x / 2;
  entity.pos.y = pos.y - entity.size.y / 2;
}

function getMatchCenter(match: TileResolverMatch) {
  return new Vec2(match.x1 + (match.x2 - match.x1) / 2, match.y1 + (match.y2 - match.y1) / 2);
}

function addShrapnel(level: Level, gameContext: GameContext, match: TileResolverMatch) {
  const center = getMatchCenter(match);

  const bricks = [];
  for (let i = 0; i < 4; i++) {
    const brick = gameContext.entityFactory['brick-shrapnel']!();
    centerEntity(brick, center);
    level.entities.add(brick);
    bricks.push(brick);
  }

  const spreadH = 60;
  const spreadV = 400;

  bricks[0].sounds.add('break');
  bricks[0].vel.set(-spreadH, -spreadV * 1.2);
  bricks[1].vel.set(-spreadH, -spreadV);
  bricks[2].vel.set(spreadH, -spreadV * 1.2);
  bricks[3].vel.set(spreadH, -spreadV);
}

const handleX: TileColliderHandler = ({ entity, match }) => {
  if (entity.vel.x > 0) {
    if (entity.bounds.right > match.x1) {
      entity.obstruct(Side.right, match);
    }
  } else if (entity.vel.x < 0) {
    if (entity.bounds.left < match.x2) {
      entity.obstruct(Side.left, match);
    }
  }
};
const handleY: TileColliderHandler = ({ entity, match, resolver, gameContext, level }) => {
  if (entity.vel.y > 0) {
    if (entity.bounds.bottom > match.y1) {
      entity.obstruct(Side.bottom, match);
    }
  } else if (entity.vel.y < 0) {
    if (entity.traits.has(Player)) {
      const grid = resolver.matrix;
      grid.delete(match.indexX, match.indexY);
      addShrapnel(level, gameContext, match);
    }

    if (entity.bounds.top < match.y2) {
      entity.obstruct(Side.top, match);
    }
  }
};
export const brick = [handleX, handleY];
