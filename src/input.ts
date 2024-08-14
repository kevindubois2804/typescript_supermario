import { Entity } from './Entity';
import KeyboardState from './KeyboardStates';
import { Go } from './traits/Go';
import Jump from './traits/Jump';

export default function setupKeyboard(mario: Entity) {
  const input = new KeyboardState();
  input.addMapping('Space', (keyState) => {
    if (keyState) {
      mario.getTrait(Jump)!.start();
    } else {
      mario.getTrait(Jump)!.cancel();
    }
  });

  input.addMapping('KeyO', (keyState) => {
    mario.turbo(keyState);
  });
  input.addMapping('ArrowRight', (keyState) => {
    mario.getTrait(Go)!.dir += keyState ? 1 : -1;
  });
  input.addMapping('ArrowLeft', (keyState) => {
    mario.getTrait(Go)!.dir += keyState ? -1 : 1;
  });

  return input;
}
