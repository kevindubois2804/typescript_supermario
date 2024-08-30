import { Entity } from './Entity';
import { InputRouter } from './InputRouter';
import { Keyboard } from './Keyboard';
import { Go } from './traits/Go';
import { Jump } from './traits/Jump';
import { PipeTraveller } from './traits/PipeTraveller';
import { Turbo } from './traits/Turbo';

enum KeyMap {
  UP = 'ArrowUp',
  DOWN = 'ArrowDown',
  LEFT = 'ArrowLeft',
  RIGHT = 'ArrowRight',
  JUMP = 'Space',
  TURBO = 'KeyO',
}

export function setupKeyboard(target: EventTarget) {
  const input = new Keyboard();
  const router = new InputRouter<Entity>();

  input.listenTo(target);

  input.addListener(KeyMap.RIGHT, (keyState) => {
    router.route((entity) => {
      entity.useTrait(Go, (go) => {
        go.dir += keyState ? 1 : -1;
      });
      entity.getTrait(PipeTraveller)!.direction.x += keyState ? 1 : -1;
    });
  });

  input.addListener(KeyMap.UP, (keyState) => {
    router.route((entity) => {
      entity.getTrait(PipeTraveller)!.direction.y += keyState ? -1 : 1;
    });
  });

  input.addListener(KeyMap.DOWN, (keyState) => {
    router.route((entity) => {
      entity.getTrait(PipeTraveller)!.direction.y += keyState ? 1 : -1;
    });
  });

  input.addListener(KeyMap.LEFT, (keyState) => {
    router.route((entity) => {
      entity.useTrait(Go, (go) => {
        go.dir += keyState ? -1 : 1;
      });
      entity.getTrait(PipeTraveller)!.direction.x += keyState ? -1 : 1;
    });
  });

  input.addListener(KeyMap.JUMP, (pressed) => {
    if (pressed) {
      router.route((entity) => {
        entity.useTrait(Jump, (jump) => jump.start());
      });
    } else {
      router.route((entity) => {
        entity.useTrait(Jump, (jump) => jump.cancel());
      });
    }
  });

  input.addListener(KeyMap.TURBO, (keyState) => {
    router.route((entity) => {
      // the turbo should probably be a separate trait
      entity.useTrait(Turbo, (it) => it.setTurboState(entity, keyState === 1));
    });
  });

  return router;
}
