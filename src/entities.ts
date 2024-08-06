import { createAnim } from './animation.js';
import { Entity } from './Entity.js';
import { loadSpriteSheet } from './loaders.js';
import { Go } from './traits/Go.js';
import Jump from './traits/Jump.js';

// setting up mario
export function createMario(): Promise<Entity> {
  return loadSpriteSheet('mario').then((sprite) => {
    const mario = new Entity();

    mario.size.set(16, 14);

    mario.addTrait(new Go());
    mario.addTrait(new Jump());

    const runAnim = createAnim(['run-1', 'run-2', 'run-3'], 10);

    // function that looks up at the mario object and decides which animation frame should be played
    function routeFrame(mario: Entity): string {
      // if the direction property in the 'Go' trait isn't zero, we should play the running animation
      if (mario.go.dir !== 0) {
        return runAnim(mario.go.distance);
      }

      return 'idle';
    }

    mario.draw = function drawMario(context) {
      sprite.draw(routeFrame(this), context, 0, 0, this.go.heading < 0);
    };

    return mario;
  });
}
