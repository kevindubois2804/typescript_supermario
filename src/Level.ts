import Compositor from './Compositor';
import { Entity } from './Entity';
import { Matrix } from './math';
import { TileCollider } from './TileCollider';
import { LevelSpecTile } from './types';

export default class Level {
  comp = new Compositor();
  entities = new Set<Entity>();
  gravity: number = 2000;
  tiles = new Matrix<LevelSpecTile>();

  tileCollider = new TileCollider(this.tiles);

  update(deltaTime: number) {
    this.entities.forEach((entity) => {
      entity.update(deltaTime);

      // we calculate the new x position
      entity.pos.x += entity.vel.x * deltaTime;

      // we run the tilecollider and do the checks on the x-axis
      this.tileCollider.checkX(entity);

      // we calculate the new y position
      entity.pos.y += entity.vel.y * deltaTime;

      // we run the tilecollider and do the checks on the y-axis
      this.tileCollider.checkY(entity);

      // after collisions checked on the y-axis apply gravity
      entity.vel.y += this.gravity * deltaTime;
    });
  }
}
