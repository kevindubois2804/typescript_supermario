import { Trait } from '../Trait';

export class InputController extends Trait {
  static KEYBORD_KEY_RIGHT_PRESSED = Symbol('key right pressed');
  static KEYBORD_KEY_LEFT_PRESSED = Symbol('key right pressed');
  static KEYBORD_KEY_UP_PRESSED = Symbol('key up pressed');
  static KEYBORD_KEY_DOWN_PRESSED = Symbol('key down pressed');
  static KEYBORD_KEY_SPACE_PRESSED = Symbol('key space pressed');
  static KEYBORD_KEY_TURBO_PRESSED = Symbol('key turbo pressed');
}
