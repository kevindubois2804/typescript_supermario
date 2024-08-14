import { AudioBoard } from '../AudioBoard';
import { Entity } from '../Entity';
import { loadSpriteSheet } from '../loaders/sprite';
import { loadAudioBoard } from '../loaders/audio';
import SpriteSheet from '../SpriteSheet';
import { Go } from '../traits/Go';
import Jump from '../traits/Jump';
import { Killable } from '../traits/Killable';
import { Physics } from '../traits/Physics';
import { Solid } from '../traits/Solid';
import { Stomper } from '../traits/Stomper';

const SLOW_DRAG = 1 / 1000;
const FAST_DRAG = 1 / 5000;

export function loadMario(audioContext: AudioContext) {
  return Promise.all([loadSpriteSheet('mario'), loadAudioBoard('mario', audioContext)]).then(([sprite, audio]) => {
    return createMarioFactory(sprite, audio);
  });
}

function createMarioFactory(sprite: SpriteSheet, audio: AudioBoard) {
  const runAnim = sprite.animations.get('run')!;

  function routeFrame(mario: Entity) {
    const jumpTrait = mario.getTrait(Jump)!;
    const goTrait = mario.getTrait(Go)!;

    if (jumpTrait.falling) {
      return 'jump';
    }

    if (goTrait.distance > 0) {
      if ((mario.vel.x > 0 && goTrait.dir < 0) || (mario.vel.x < 0 && goTrait.dir > 0)) {
        return 'break';
      }

      return runAnim(goTrait.distance);
    }

    return 'idle';
  }

  function setTurboState(turboOff: boolean) {
    this.useTrait(Go, (g: Go) => (g.dragFactor = turboOff ? SLOW_DRAG : FAST_DRAG));
    // this.go.dragFactor = turboOff ? SLOW_DRAG : FAST_DRAG;
  }

  function drawMario(context: CanvasRenderingContext2D) {
    sprite.draw(routeFrame(this), context, 0, 0, this.getTrait(Go)!.heading < 0);
  }

  return function createMario() {
    const mario = new Entity();
    mario.audio = audio;
    mario.size.set(14, 16);

    mario.addTrait(new Physics());
    mario.addTrait(new Solid());
    mario.addTrait(new Go());
    mario.addTrait(new Jump());
    mario.addTrait(new Killable());
    mario.addTrait(new Stomper());

    mario.useTrait(Killable, (k) => (k.removeAfter = 0));

    mario.turbo = setTurboState;
    mario.draw = drawMario;

    mario.turbo(false);

    return mario;
  };
}
