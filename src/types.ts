import Camera from './Camera';

export type LayerFunction = (context: CanvasRenderingContext2D, camera: Camera) => void;

export type Position = {
  x: number;
  y: number;
};

export type KeyListener = (keyState: number) => void;

export type TileRange = number[];

export type LevelSpecTile = {
  type: string;
  name: string;
  // pattern?: string;
  // ranges: TileRange[];
};

export type SpriteSheetSpec = {
  imageURL: string;
  tileW: number;
  tileH: number;
  tiles?: SpriteTileSpec[];
};

export type SpriteTileSpec = {
  name: string;
  index: [number, number];
};

export type FrameSpec = {
  name: string;
  rect: [number, number, number, number];
};

export type LevelSpec = {
  spriteSheet: string;
  backgrounds: BackgroundSpec[];
};
export type BackgroundSpec = {
  tile: string;
  type: string;
  ranges: BackgroundRange[];
};
export type BackgroundRange = [number, number, number, number];
