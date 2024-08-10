import Compositor from './Compositor';
import { Entity } from './Entity';
import { EntityCollider } from './EntityCollider';
import { Matrix } from './math';
import { TileCollider } from './TileCollider';

export type CollisionTile = {
  type: string;
};

export type BackgroundTile = {
  name: string;
};

export type TileResolverMatch<TileType> = {
  tile: TileType;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
};

export default class Level {
  comp = new Compositor();
  entities = new Set<Entity>();
  gravity: number = 1500;
  totalTime = 0;
  tileCollider: TileCollider;
  entityCollider = new EntityCollider(this.entities);
  // // legacy code
  // tiles = new Matrix<LevelSpecTile>();
  // tileCollider = new TileCollider(this.tiles);

  setCollisionGrid(matrix: Matrix<CollisionTile>) {
    this.tileCollider = new TileCollider(matrix);
  }

  update(deltaTime: number) {
    this.entities.forEach((entity) => {
      entity.update(deltaTime, this);
    });

    this.entities.forEach((entity) => {
      this.entityCollider.check(entity);
    });

    this.entities.forEach((entity) => {
      entity.finalize();
    });

    this.totalTime += deltaTime;
  }
}
