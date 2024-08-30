import { Entity } from '../Entity';
import { GameContext } from '../GameContext';
import { Trait } from '../Trait';
import { Go } from './Go';

const FAST_DRAG = 1 / 5000;
const SLOW_DRAG = 1 / 1000;

export class Turbo extends Trait {
  update(entity: Entity, { deltaTime }: GameContext) {}

  setTurboState(entity: Entity, turboState: boolean) {
    const go = entity.getTrait(Go)!;
    go.dragFactor = turboState ? FAST_DRAG : SLOW_DRAG;
  }
}
