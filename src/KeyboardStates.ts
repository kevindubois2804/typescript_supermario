import { KeyListener } from './types';

const PRESSED = 1;
const RELEASED = 0;

export default class KeyboardState {
  // Holds the current state of a given key
  keyStates = new Map<string, number>();

  // Holds the callback functions for a key code
  keyMap = new Map<string, KeyListener>();

  addMapping(keyCode: string, callback: KeyListener) {
    this.keyMap.set(keyCode, callback);
  }

  handleEvent(event: KeyboardEvent) {
    const { code } = event;

    if (!this.keyMap.has(code)) {
      // Did not have key mapped.
      return;
    }

    event.preventDefault();

    const keyState = event.type === 'keydown' ? PRESSED : RELEASED;

    if (this.keyStates.get(code) === keyState) {
      return;
    }

    this.keyStates.set(code, keyState);

    this.keyMap.get(code)?.(keyState);
  }

  listenTo(window: Window) {
    ['keydown', 'keyup'].forEach((eventName) => {
      window.addEventListener(eventName, (event) => {
        this.handleEvent(event as KeyboardEvent);
      });
    });
  }
}
