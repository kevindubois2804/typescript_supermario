import { Trait } from '../Trait';

export class InputNotifier extends Trait {
  static KEYBORD_KEY_RIGHT_PRESSED = Symbol('key right pressed');
  static KEYBORD_KEY_LEFT_PRESSED = Symbol('key right pressed');
  static KEYBORD_KEY_UP_PRESSED = Symbol('key up pressed');
}
