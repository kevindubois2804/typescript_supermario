import { Matrix } from './math';
import { TileSpec } from './types';

export type TileResolverMatch = {
  tile: TileSpec;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
};

// the tile resolver job is to convert world positions to tile indexes
export class TileResolver {
  constructor(public matrix: Matrix<TileSpec>, public tileSize = 16) {}

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
      return {
        tile,
        x1,
        x2,
        y1,
        y2,
      };
    }
  }

  // return the tile that we find for a world position
  searchByPosition(posX: number, posY: number) {
    return this.getByIndex(this.toIndex(posX), this.toIndex(posY));
  }

  // return all the tiles that we find for a range of world positions
  searchByRange(x1: number, x2: number, y1: number, y2: number) {
    // we collect the matches
    const matches = [] as TileResolverMatch[];

    // we iterate over the ranges
    this.toIndexRange(x1, x2).forEach((indexX) => {
      this.toIndexRange(y1, y2).forEach((indexY) => {
        const match = this.getByIndex(indexX, indexY);
        if (match) {
          matches.push(match);
        }
      });
    });
    return matches;
  }
}
