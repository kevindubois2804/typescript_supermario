export interface LevelData {
  backgrounds: LevelBackgroundData[];
}

export interface LevelBackgroundData {
  tile: string;
  ranges: number[][];
}

export type LayerFunction = (context: CanvasRenderingContext2D) => void;

export type Position = {
  x: number;
  y: number;
};

export type KeyListener = (keyState: number) => void;

export type TileSpec = {
  name: string;
  // index: [number, number]
};

export type TileRange = number[];

export type LevelSpecTile = {
  type: string;
  name?: string;
  pattern?: string;
  ranges: TileRange[];
};
