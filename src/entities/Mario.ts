import { AnimationResolver } from '../AnimationResolver';
import { AudioBoard } from '../AudioBoard';
import { Entity } from '../Entity';
import { loadAudioBoard } from '../loaders/audio';
import { loadSpriteSheet } from '../loaders/sprite';
import { SpriteSheet } from '../SpriteSheet';
import { Go } from '../traits/Go';
import { InputController } from '../traits/InputController';
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
//   const runAnimationResolver = sprite.animations.get('run') as AnimationResolver;
//   const climbAnimationResolver = sprite.animations.get('climb') as AnimationResolver;

//   function getHeading(mario: Entity) {
//     const poleTraveller = mario.getTrait(PoleTraveller)!;
//     if (poleTraveller.distance) {
//       return false;
//     }
//     if (!mario.getTrait(Go)) {
//       return false;
//     }
//     return mario.getTrait(Go)!.heading < 0;
//   }

//   function routeFrame(mario: Entity) {
//     const pipeTraveller = mario.getTrait(PipeTraveller)!;
//     if (pipeTraveller.movement.x != 0) {
//       return runAnimationResolver.resolveFrame(pipeTraveller.distance.x * 2);
//     }
//     if (pipeTraveller.movement.y != 0) {
//       return 'idle';
//     }

//     const poleTraveller = mario.getTrait(PoleTraveller)!;
//     if (poleTraveller.distance) {
//       return climbAnimationResolver.resolveFrame(poleTraveller.distance);
//     }

//     if (mario.getTrait(Jump)!.falling) {
//       return 'jump';
//     }

//     const go = mario.getTrait(Go);
//     if (go && go.distance > 0) {
//       if ((mario.vel.x > 0 && go.dir < 0) || (mario.vel.x < 0 && go.dir > 0)) {
//         return 'break';
//       }

//       return runAnimationResolver.resolveFrame(mario.getTrait(Go)!.distance);
//     }

//     return 'idle';
//   }

//   function drawMario(context: CanvasRenderingContext2D) {
//     sprite.draw(routeFrame(this), context, 0, 0, getHeading(this));
//   }

//   return function createMario() {
//     const mario = new Entity();
//     mario.sprite = sprite;
//     mario.audio = audio;
//     mario.size.set(14, 16);

//     mario.addTrait(new Physics());
//     mario.addTrait(new Solid());
//     mario.addTrait(new Go());
//     mario.addTrait(new Jump());
//     mario.addTrait(new Killable());
//     mario.addTrait(new Stomper());
//     mario.addTrait(new InputController());
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

function PipeTravellingRouteAnim(entity: Entity): void | string {
  const runAnimationResolver = entity.sprite.animationManager.resolvers.get('run') as AnimationResolver;
  const pipeTraveller = entity.getTrait(PipeTraveller)!;
  if (pipeTraveller.movement.x != 0) {
    return runAnimationResolver.resolveFrame(pipeTraveller.distance.x * 2);
  }
  if (pipeTraveller.movement.y != 0) {
    return 'idle';
  }
}

function PoleTravellingRouteAnim(entity: Entity): void | string {
  const climbAnimationResolver = entity.sprite.animationManager.resolvers.get('climb') as AnimationResolver;
  const poleTraveller = entity.getTrait(PoleTraveller)!;
  if (poleTraveller.distance) {
    return climbAnimationResolver.resolveFrame(poleTraveller.distance);
  }
}

function JumpRouteAnim(entity: Entity): void | string {
  if (entity.getTrait(Jump)!.falling) {
    return 'jump';
  }
}

function MovingRouteAnim(entity: Entity): void | string {
  const runAnimationResolver = entity.sprite.animationManager.resolvers.get('run') as AnimationResolver;
  const go = entity.getTrait(Go);
  if (go && go.distance > 0) {
    if ((entity.vel.x > 0 && go.dir < 0) || (entity.vel.x < 0 && go.dir > 0)) {
      return 'break';
    }

    return runAnimationResolver.resolveFrame(entity.getTrait(Go)!.distance);
  }
}

function createMarioFactory(sprite: SpriteSheet, audio: AudioBoard) {
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

  sprite.animationManager.addRoute('pole-travelling', PoleTravellingRouteAnim);
  sprite.animationManager.addRoute('pipe-travelling', PipeTravellingRouteAnim);
  sprite.animationManager.addRoute('jumping', JumpRouteAnim);
  sprite.animationManager.addRoute('moving', MovingRouteAnim);
  sprite.animationManager.setDefaultAnimName('idle');

  function drawMario(context: CanvasRenderingContext2D) {
    sprite.draw(sprite.animationManager.routeFrame(this), context, 0, 0, getHeading(this));
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
    mario.addTrait(new InputController());
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
