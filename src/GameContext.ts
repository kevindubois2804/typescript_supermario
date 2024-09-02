import { EntityFactory } from './entities';
import { InputHandler } from './InputHandler';
import { InputRouter } from './InputRouter';
import { Dict } from './types';

export type GameContext = {
  audioContext: AudioContext;
  deltaTime: number;
  entityFactory: Dict<EntityFactory>;
  videoContext: CanvasRenderingContext2D;
  tick: number;
  inputRouter: InputRouter;
  inputHandler: InputHandler;
};
