import Camera from './Camera';

export type LayerFunction = (context: CanvasRenderingContext2D, camera: Camera) => void;

export type Position = {
  x: number;
  y: number;
};

export type KeyListener = (keyState: number) => void;

export type SpriteSheetSpec = {
  imageURL: string;
  tileW: number;
  tileH: number;
  tiles?: SpriteTileSpec[];
  frames?: FrameSpec[];
  animations?: AnimationSpec[];
};

export type SpriteTileSpec = {
  name: string;
  index: [number, number];
};

export type LevelSpec = {
  spriteSheet: string;
  patterns: LevelSpecPatterns;
  layers: LevelSpecLayer[];
  entities: LevelSpecEntity[];
};

export type LevelSpecEntity = {
  name: string;
  pos: [number, number];
};

export type LevelSpecPatterns = {
  [name: string]: {
    tiles: LevelSpecTile[];
  };
};

export type LevelSpecLayer = {
  tiles: LevelSpecTile[];
};

export type LevelSpecTile = {
  type: string;
  name: string;
  pattern?: string;
  ranges: TileRange[];
};

export type TileRange = number[];

export type AnimationSpec = {
  name: string;
  frameLen: number;
  frames: string[];
};

export type FrameSpec = {
  name: string;
  rect: [number, number, number, number];
};
