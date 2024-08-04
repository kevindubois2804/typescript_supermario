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
