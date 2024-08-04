import { Entity } from './Entity.js';
import { loadMarioSprite } from './sprites.js';
import Jump from './traits/Jump.js';
import Velocity from './traits/Velocity.js';

// setting up mario
export function createMario(): Promise<Entity> {
  return loadMarioSprite().then((sprite) => {
    const mario = new Entity();

    mario.addTrait(new Velocity());
    mario.addTrait(new Jump());
    console.log(mario.jump);

    mario.draw = function drawMario(context) {
      sprite.draw('idle', context, this.pos.x, this.pos.y);
    };

    return mario;
  });
}
