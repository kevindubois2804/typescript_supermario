import { InputRouter } from './InputRouter';
import { InputHandler } from './InputHandler';
import { InputController } from './traits/InputController';

export enum KeyMap {
  UP = 'ArrowUp',
  DOWN = 'ArrowDown',
  LEFT = 'ArrowLeft',
  RIGHT = 'ArrowRight',
  JUMP = 'Space',
  TURBO = 'KeyO',
}

export function setupKeyboard(target: EventTarget) {
  const inputHandler = new InputHandler();
  const inputRouter = new InputRouter();

  inputHandler.listenTo(target);

  inputHandler.addListener(KeyMap.RIGHT, (keyState) => {
    inputRouter.route((entity) => {
      if (!entity.getTrait(InputController)) return;
      entity.events.emit(InputController.KEYBORD_KEY_RIGHT_PRESSED, keyState);
      // entity.getTrait(PipeTraveller)!.direction.x += keyState ? 1 : -1;
    });
  });

  inputHandler.addListener(KeyMap.UP, (keyState) => {
    inputRouter.route((entity) => {
      if (!entity.getTrait(InputController)) return;
      entity.events.emit(InputController.KEYBORD_KEY_UP_PRESSED, keyState);
    });
  });

  inputHandler.addListener(KeyMap.DOWN, (keyState) => {
    inputRouter.route((entity) => {
      if (!entity.getTrait(InputController)) return;
      entity.events.emit(InputController.KEYBORD_KEY_DOWN_PRESSED, keyState);
    });
  });

  inputHandler.addListener(KeyMap.LEFT, (keyState) => {
    inputRouter.route((entity) => {
      if (!entity.getTrait(InputController)) return;
      entity.events.emit(InputController.KEYBORD_KEY_LEFT_PRESSED, keyState);
    });
  });

  inputHandler.addListener(KeyMap.JUMP, (pressed) => {
    if (pressed) {
      inputRouter.route((entity) => {
        if (!entity.getTrait(InputController)) return;
        entity.events.emit(InputController.KEYBORD_KEY_SPACE_PRESSED, pressed);
      });
    } else {
      inputRouter.route((entity) => {
        if (!entity.getTrait(InputController)) return;
        entity.events.emit(InputController.KEYBORD_KEY_SPACE_PRESSED, pressed);
      });
    }
  });

  inputHandler.addListener(KeyMap.TURBO, (keyState) => {
    inputRouter.route((entity) => {
      if (!entity.getTrait(InputController)) return;
      entity.events.emit(InputController.KEYBORD_KEY_TURBO_PRESSED, keyState, entity);
    });
  });

  return { inputRouter, inputHandler };
}
