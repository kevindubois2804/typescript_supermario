import { DirectionKeys } from './math';

export type Position = {
  x: number;
  y: number;
};

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
  musicSheet: string;
  patternSheet: string;
  patterns: LevelSpecPatterns;
  layers: LevelSpecLayer[];
  entities: LevelSpecEntity[];
  triggers?: LevelSpecTrigger[];
  checkpoints: LevelCheckpoint[];
};

export type LevelSpecEntity = {
  id?: number;
  name: string;
  pos: [number, number];
  props?: EntityProps;
};

export type EntityProps = {
  dir: DirectionKeys;
  goesTo: { name: string };
  bacTo: [number, number];
};

export type LevelSpecPatterns = {
  [name: string]: {
    tiles: LevelSpecTile[];
  };
};

export type LevelSpecTrigger = {
  type: string;
  name: string;
  pos: [number, number];
  size: [number, number];
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

export type LevelCheckpoint = [number, number];

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

export type Dict<T> = { [_ in string]?: T };
