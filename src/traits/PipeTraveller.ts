import { Vec2 } from '../math';
import { Trait } from '../Trait';
import { InputController } from './InputController';

export class PipeTraveller extends Trait {
  direction = new Vec2(0, 0);
  movement = new Vec2(0, 0);
  distance = new Vec2(0, 0);
  constructor() {
    super();
    this.listen(InputController.KEYBORD_KEY_RIGHT_PRESSED, (leftState, rightState) => {
      this.direction.x = rightState - leftState;
    });
    this.listen(InputController.KEYBORD_KEY_LEFT_PRESSED, (leftState, rightState) => {
      this.direction.x = rightState - leftState;
    });
    this.listen(InputController.KEYBORD_KEY_DOWN_PRESSED, (upState, downState) => {
      this.direction.y = downState - upState;
    });
    this.listen(InputController.KEYBORD_KEY_UP_PRESSED, (upState, downState) => {
      this.direction.y = downState - upState;
    });
  }
}
