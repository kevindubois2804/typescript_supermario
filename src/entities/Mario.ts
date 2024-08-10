import { Entity } from '../Entity';
import { loadSpriteSheet } from '../loaders';
import SpriteSheet from '../SpriteSheet';
import { Go } from '../traits/Go';
import Jump from '../traits/Jump';
import { Killable } from '../traits/Killable';
import { Physics } from '../traits/Physics';
import { Solid } from '../traits/Solid';
import { Stomper } from '../traits/Stomper';

const SLOW_DRAG = 1 / 1000;
const FAST_DRAG = 1 / 5000;

export function loadMario() {
  return loadSpriteSheet('mario').then(createMarioFactory);
}

function createMarioFactory(sprite: SpriteSheet) {
  const runAnim = sprite.animations.get('run')!;

  function routeFrame(mario: Entity) {
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

  function setTurboState(turboOff: boolean) {
    this.go.dragFactor = turboOff ? SLOW_DRAG : FAST_DRAG;
  }

  function drawMario(context: CanvasRenderingContext2D) {
    sprite.draw(routeFrame(this), context, 0, 0, this.go.heading < 0);
  }

  return function createMario() {
    const mario = new Entity();
    mario.size.set(14, 16);

    mario.addTrait(new Physics());
    mario.addTrait(new Solid());
    mario.addTrait(new Go());
    mario.addTrait(new Jump());
    mario.addTrait(new Killable());
    mario.addTrait(new Stomper());

    mario.killable.removeAfter = 0;

    mario.turbo = setTurboState;
    mario.draw = drawMario;

    mario.turbo(false);

    return mario;
  };
}
