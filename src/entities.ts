import { Entity } from './Entity.js';
import { loadMarioSprite } from './sprites.js';
import { Go } from './traits/Go.js';
import Jump from './traits/Jump.js';

// setting up mario
export function createMario(): Promise<Entity> {
  return loadMarioSprite().then((sprite) => {
    const mario = new Entity();
    mario.size.set(56, 64);

    mario.addTrait(new Go());
    mario.addTrait(new Jump());

    mario.draw = function drawMario(context) {
      sprite.draw('idle', context, this.pos.x, this.pos.y);
    };

    return mario;
  });
}
