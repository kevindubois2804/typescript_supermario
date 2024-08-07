import { Entity } from './Entity';
import KeyboardState from './KeyboardStates';

export default function setupKeyboard(mario: Entity) {
  const input = new KeyboardState();
  input.addMapping('Space', (keyState) => {
    if (keyState) {
      mario.jump.start();
    } else {
      mario.jump.cancel();
    }
  });

  input.addMapping('KeyO', (keyState) => {
    mario.turbo(keyState);
  });
  input.addMapping('ArrowRight', (keyState) => {
    mario.go.dir += keyState ? 1 : -1;
  });
  input.addMapping('ArrowLeft', (keyState) => {
    mario.go.dir += keyState ? -1 : 1;
  });

  return input;
}
