import { Entity } from '../Entity';
import { GameContext } from '../GameContext';
import { Level } from '../Level';
import { Vec2 } from '../math';
import { Trait } from '../Trait';
import { InputController } from './InputController';

export class PipeTraveller extends Trait {
  direction = new Vec2(0, 0);
  movement = new Vec2(0, 0);
  distance = new Vec2(0, 0);
  constructor() {
    super();
    this.listen(InputController.KEYBORD_KEY_RIGHT_PRESSED, (keyState: 0 | 1) => {
      this.direction.x += keyState ? 1 : -1;
    });
    this.listen(InputController.KEYBORD_KEY_LEFT_PRESSED, (keyState: 0 | 1) => {
      this.direction.x += keyState ? -1 : 1;
    });
    this.listen(InputController.KEYBORD_KEY_DOWN_PRESSED, (keyState: 0 | 1) => {
      this.direction.y += keyState ? 1 : -1;
    });
    this.listen(InputController.KEYBORD_KEY_UP_PRESSED, (keyState: 0 | 1) => {
      this.direction.y += keyState ? -1 : 1;
    });
  }
}
