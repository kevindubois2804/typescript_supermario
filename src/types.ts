export interface LevelData {
  backgrounds: LevelBackgroundData[];
}

export interface LevelBackgroundData {
  tile: string;
  ranges: number[][];
}
