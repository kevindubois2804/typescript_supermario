import { Matrix } from './math';
import { LevelSpecTile } from './types';

export type TileResolverMatch = {
  tile: LevelSpecTile;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  indexX: number;
  indexY: number;
};

export type TileResolverMatrix = Matrix<LevelSpecTile>;

// the tile resolver job is to convert world positions to tile indexes
export class TileResolver {
  constructor(public matrix: TileResolverMatrix, public tileSize = 16) {}

  // take a position and returns the index of that position
  toIndex(pos: number) {
    return Math.floor(pos / this.tileSize);
  }

  toIndexRange(pos1: number, pos2: number) {
    // pMax is where our search range should stop
    const pMax = Math.ceil(pos2 / this.tileSize) * this.tileSize;

    // we collect all the indexes of our search range
    const range = [];
    let pos = pos1;
    do {
      range.push(this.toIndex(pos));
      pos += this.tileSize;
    } while (pos < pMax);
    return range;
  }

  // method that returns a tile based on indexes
  getByIndex(indexX: number, indexY: number): TileResolverMatch | undefined {
    const tile = this.matrix.get(indexX, indexY);
    if (tile) {
      const x1 = indexX * this.tileSize;
      const x2 = x1 + this.tileSize;
      const y1 = indexY * this.tileSize;
      const y2 = y1 + this.tileSize;
      return { tile, x1, x2, y1, y2, indexX, indexY };
    }
  }

  // return the tile that we find for a world position
  searchByPosition(posX: number, posY: number) {
    return this.getByIndex(this.toIndex(posX), this.toIndex(posY));
  }

  // return all the tiles that we find for a range of world positions
  *searchByRange(x1: number, x2: number, y1: number, y2: number) {
    for (const indexX of this.toIndexRange(x1, x2)) {
      for (const indexY of this.toIndexRange(y1, y2)) {
        const match = this.getByIndex(indexX, indexY);
        if (match) {
          yield match;
        }
      }
    }
  }
}
