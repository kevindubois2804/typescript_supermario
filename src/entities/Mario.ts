import { AnimationResolver } from '../AnimationResolver';
import { AudioBoard } from '../AudioBoard';
import { Entity } from '../Entity';
import { loadAudioBoard } from '../loaders/audio';
import { loadSpriteSheet } from '../loaders/sprite';
import { SpriteSheet } from '../SpriteSheet';
import { Go } from '../traits/Go';
import { InputNotifier } from '../traits/InputNotifier';
import { Jump } from '../traits/Jump';
import { Killable } from '../traits/Killable';
import { Physics } from '../traits/Physics';
import { PipeTraveller } from '../traits/PipeTraveller';
import PoleTraveller from '../traits/PoleTraveller';
import { Solid } from '../traits/Solid';
import { Stomper } from '../traits/Stomper';
import { Turbo } from '../traits/Turbo';

export function loadMario(audioContext: AudioContext) {
  return Promise.all([loadSpriteSheet('mario'), loadAudioBoard('mario', audioContext)]).then(([sprite, audio]) => {
    return createMarioFactory(sprite, audio);
  });
}

// function createMarioFactory(sprite: SpriteSheet, audio: AudioBoard) {
//   const runAnim = sprite.animations.get('run') as Animation;
//   const climbAnim = sprite.animations.get('climb') as Animation;

//   function getHeading(mario: Entity) {
//     const poleTraveller = mario.getTrait(PoleTraveller)!;
//     if (poleTraveller.distance) {
//       return false;
//     }
//     return mario.getTrait(Go)!.heading < 0;
//   }

//   function routeFrame(mario: Entity) {
//     const pipeTraveller = mario.getTrait(PipeTraveller)!;
//     if (pipeTraveller.movement.x != 0) {
//       return runAnim(pipeTraveller.distance.x * 2);
//     }
//     if (pipeTraveller.movement.y != 0) {
//       return 'idle';
//     }

//     const poleTraveller = mario.getTrait(PoleTraveller)!;
//     if (poleTraveller.distance) {
//       return climbAnim(poleTraveller.distance);
//     }

//     if (mario.getTrait(Jump)!.falling) {
//       return 'jump';
//     }

//     const go = mario.getTrait(Go)!;
//     if (go.distance > 0) {
//       if ((mario.vel.x > 0 && go.dir < 0) || (mario.vel.x < 0 && go.dir > 0)) {
//         return 'break';
//       }

//       return runAnim(mario.getTrait(Go)!.distance);
//     }

//     return 'idle';
//   }

//   function drawMario(context: CanvasRenderingContext2D) {
//     sprite.draw(routeFrame(this), context, 0, 0, getHeading(this));
//   }

//   return function createMario() {
//     const mario = new Entity();
//     mario.audio = audio;
//     mario.size.set(14, 16);

//     mario.addTrait(new Physics());
//     mario.addTrait(new Solid());
//     mario.addTrait(new Go());
//     mario.addTrait(new Jump());
//     mario.addTrait(new Killable());
//     mario.addTrait(new Stomper());
//     mario.addTrait(new PipeTraveller());
//     mario.addTrait(new PoleTraveller());
//     mario.addTrait(new Turbo());

//     mario.getTrait(Killable)!.removeAfter = Infinity;
//     mario.getTrait(Jump)!.velocity = 175;

//     mario.draw = drawMario;

//     mario.useTrait(Turbo, (it) => it.setTurboState(mario, false));

//     return mario;
//   };
// }

function createMarioFactory(sprite: SpriteSheet, audio: AudioBoard) {
  const runAnimationResolver = sprite.animations.get('run') as AnimationResolver;
  const climbAnimationResolver = sprite.animations.get('climb') as AnimationResolver;

  function getHeading(mario: Entity) {
    const poleTraveller = mario.getTrait(PoleTraveller)!;
    if (poleTraveller.distance) {
      return false;
    }
    if (!mario.getTrait(Go)) {
      return false;
    }
    return mario.getTrait(Go)!.heading < 0;
  }

  function routeFrame(mario: Entity) {
    const pipeTraveller = mario.getTrait(PipeTraveller)!;
    if (pipeTraveller.movement.x != 0) {
      return runAnimationResolver.resolveFrame(pipeTraveller.distance.x * 2);
    }
    if (pipeTraveller.movement.y != 0) {
      return 'idle';
    }

    const poleTraveller = mario.getTrait(PoleTraveller)!;
    if (poleTraveller.distance) {
      return climbAnimationResolver.resolveFrame(poleTraveller.distance);
    }

    if (mario.getTrait(Jump)!.falling) {
      return 'jump';
    }

    const go = mario.getTrait(Go);
    if (go && go.distance > 0) {
      if ((mario.vel.x > 0 && go.dir < 0) || (mario.vel.x < 0 && go.dir > 0)) {
        return 'break';
      }

      return runAnimationResolver.resolveFrame(mario.getTrait(Go)!.distance);
    }

    return 'idle';
  }

  function drawMario(context: CanvasRenderingContext2D) {
    sprite.draw(routeFrame(this), context, 0, 0, getHeading(this));
  }

  return function createMario() {
    const mario = new Entity();
    mario.sprite = sprite;
    mario.audio = audio;
    mario.size.set(14, 16);

    mario.addTrait(new Physics());
    mario.addTrait(new Solid());
    mario.addTrait(new Go());
    mario.addTrait(new Jump());
    mario.addTrait(new Killable());
    mario.addTrait(new Stomper());
    mario.addTrait(new InputNotifier());
    mario.addTrait(new PipeTraveller());
    mario.addTrait(new PoleTraveller());
    mario.addTrait(new Turbo());

    mario.getTrait(Killable)!.removeAfter = Infinity;
    mario.getTrait(Jump)!.velocity = 175;

    mario.draw = drawMario;

    mario.useTrait(Turbo, (it) => it.setTurboState(mario, false));

    return mario;
  };
}
