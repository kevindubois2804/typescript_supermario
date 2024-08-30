import { Animation } from '../animation';
import { AudioBoard } from '../AudioBoard';
import { Entity } from '../Entity';
import { loadAudioBoard } from '../loaders/audio';
import { loadSpriteSheet } from '../loaders/sprite';
import { SpriteSheet } from '../SpriteSheet';
import { Go } from '../traits/Go';
import { Jump } from '../traits/Jump';
import { Killable } from '../traits/Killable';
import { Physics } from '../traits/Physics';
import { PipeTraveller } from '../traits/PipeTraveller';
import { Solid } from '../traits/Solid';
import { Stomper } from '../traits/Stomper';
import { Turbo } from '../traits/Turbo';

export function loadMario(audioContext: AudioContext) {
  return Promise.all([loadSpriteSheet('mario'), loadAudioBoard('mario', audioContext)]).then(([sprite, audio]) => {
    return createMarioFactory(sprite, audio);
  });
}

function createMarioFactory(sprite: SpriteSheet, audio: AudioBoard) {
  const runAnim = sprite.animations.get('run') as Animation;

  function routeFrame(mario: Entity) {
    if (mario.getTrait(Jump)!.falling) {
      return 'jump';
    }

    const pipeTraveller = mario.getTrait(PipeTraveller)!;
    if (pipeTraveller.movement.x != 0) {
      return runAnim(pipeTraveller.distance.x * 2);
    }

    const go = mario.getTrait(Go)!;
    if (go.distance > 0) {
      if ((mario.vel.x > 0 && go.dir < 0) || (mario.vel.x < 0 && go.dir > 0)) {
        return 'break';
      }

      return runAnim(mario.getTrait(Go)!.distance);
    }

    return 'idle';
  }

  function drawMario(context: CanvasRenderingContext2D) {
    sprite.draw(routeFrame(this), context, 0, 0, this.traits.get(Go).heading < 0);
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
    mario.addTrait(new PipeTraveller());
    mario.addTrait(new Turbo());

    mario.getTrait(Killable)!.removeAfter = Infinity;
    mario.getTrait(Jump)!.velocity = 175;

    mario.draw = drawMario;

    mario.useTrait(Turbo, (it) => it.setTurboState(mario, false));

    return mario;
  };
}
