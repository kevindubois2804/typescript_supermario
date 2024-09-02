import { InputRouter } from './InputRouter';
import { InputHandler } from './InputHandler';
import { InputNotifier } from './traits/InputNotifier';
import { Jump } from './traits/Jump';
import { PipeTraveller } from './traits/PipeTraveller';
import { Turbo } from './traits/Turbo';

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
      if (!entity.getTrait(InputNotifier)) return;
      entity.events.emit(InputNotifier.KEYBORD_KEY_RIGHT_PRESSED, keyState);
      entity.getTrait(PipeTraveller)!.direction.x += keyState ? 1 : -1;
    });
  });

  inputHandler.addListener(KeyMap.UP, (keyState) => {
    inputRouter.route((entity) => {
      entity.getTrait(PipeTraveller)!.direction.y += keyState ? -1 : 1;
    });
  });

  inputHandler.addListener(KeyMap.DOWN, (keyState) => {
    inputRouter.route((entity) => {
      entity.getTrait(PipeTraveller)!.direction.y += keyState ? 1 : -1;
    });
  });

  inputHandler.addListener(KeyMap.LEFT, (keyState) => {
    inputRouter.route((entity) => {
      if (!entity.getTrait(InputNotifier)) return;
      entity.events.emit(InputNotifier.KEYBORD_KEY_LEFT_PRESSED, keyState);
      entity.getTrait(PipeTraveller)!.direction.x += keyState ? -1 : 1;
    });
  });

  inputHandler.addListener(KeyMap.JUMP, (pressed) => {
    if (pressed) {
      inputRouter.route((entity) => {
        entity.useTrait(Jump, (jump) => jump.start());
      });
    } else {
      inputRouter.route((entity) => {
        entity.useTrait(Jump, (jump) => jump.cancel());
      });
    }
  });

  inputHandler.addListener(KeyMap.TURBO, (keyState) => {
    inputRouter.route((entity) => {
      // the turbo should probably be a separate trait
      entity.useTrait(Turbo, (it) => it.setTurboState(entity, keyState === 1));
    });
  });

  return { inputRouter, inputHandler };
}

// export function setupKeyboard(target: EventTarget) {
//   const input = new Keyboard();
//   const inputRouter = new InputinputRouter();

//   input.listenTo(target);

//   input.addListener(KeyMap.RIGHT, (keyState) => {
//     inputRouter.route((entity) => {
//       // entity.useTrait(Go, (go) => {
//       //   go.dir += keyState ? 1 : -1;
//       // });
//       entity.getTrait(PipeTraveller)!.direction.x += keyState ? 1 : -1;
//     });
//   });

//   input.addListener(KeyMap.UP, (keyState) => {
//     inputRouter.route((entity) => {
//       entity.getTrait(PipeTraveller)!.direction.y += keyState ? -1 : 1;
//     });
//   });

//   input.addListener(KeyMap.DOWN, (keyState) => {
//     inputRouter.route((entity) => {
//       entity.getTrait(PipeTraveller)!.direction.y += keyState ? 1 : -1;
//     });
//   });

//   input.addListener(KeyMap.LEFT, (keyState) => {
//     inputRouter.route((entity) => {
//       entity.useTrait(Go, (go) => {
//         go.dir += keyState ? -1 : 1;
//       });
//       entity.getTrait(PipeTraveller)!.direction.x += keyState ? -1 : 1;
//     });
//   });

//   input.addListener(KeyMap.JUMP, (pressed) => {
//     if (pressed) {
//       inputRouter.route((entity) => {
//         entity.useTrait(Jump, (jump) => jump.start());
//       });
//     } else {
//       inputRouter.route((entity) => {
//         entity.useTrait(Jump, (jump) => jump.cancel());
//       });
//     }
//   });

//   input.addListener(KeyMap.TURBO, (keyState) => {
//     inputRouter.route((entity) => {
//       // the turbo should probably be a separate trait
//       entity.useTrait(Turbo, (it) => it.setTurboState(entity, keyState === 1));
//     });
//   });

//   return inputRouter;
// }
