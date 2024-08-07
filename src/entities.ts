import { createAnim } from './animation.js';
import { Entity } from './Entity.js';
import { loadSpriteSheet } from './loaders.js';
import { Go } from './traits/Go.js';
import Jump from './traits/Jump.js';

const SLOW_DRAG = 1 / 1000;
const FAST_DRAG = 1 / 5000;

// setting up mario
export function createMario(): Promise<Entity> {
  return loadSpriteSheet('mario').then((sprite) => {
    const mario = new Entity();

    mario.size.set(16, 14);

    mario.addTrait(new Go());
    mario.go.dragFactor = FAST_DRAG;
    mario.addTrait(new Jump());

    mario.turbo = function setTurboState(turboOff: boolean) {
      this.go.dragFactor = turboOff ? SLOW_DRAG : FAST_DRAG;
    };

    const runAnim = createAnim(['run-1', 'run-2', 'run-3'], 10);

    // function that looks up at the mario object and decides which animation frame should be played
    function routeFrame(mario: Entity): string {
      if (mario.jump.falling) {
        return 'jump';
      }

      if (mario.go.distance > 0) {
        if ((mario.vel.x > 0 && mario.go.dir < 0) || (mario.vel.x < 0 && mario.go.dir > 0)) {
          return 'break';
        }
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
