import { Entity } from '../Entity';
import { Trait } from '../Trait';
import { Go } from './Go';
import { InputController } from './InputController';

const FAST_DRAG = 1 / 5000;
const SLOW_DRAG = 1 / 1000;

export class Turbo extends Trait {
  constructor() {
    super();
    this.listen(InputController.KEYBORD_KEY_TURBO_PRESSED, (keyState: 0 | 1, entity: Entity) => {
      this.setTurboState(entity, keyState === 1);
    });
  }

  setTurboState(entity: Entity, turboState: boolean) {
    const go = entity.getTrait(Go)!;
    go.dragFactor = turboState ? FAST_DRAG : SLOW_DRAG;
  }
}
