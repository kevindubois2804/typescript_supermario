import { AnimationResolver } from '../AnimationResolver';
import { AudioBoard } from '../AudioBoard';
import { CollectionTrait } from '../CollectionTrait';
import { Entity } from '../Entity';
import { loadAudioBoard } from '../loaders/audio';
import { loadSpriteSheet } from '../loaders/sprite';
import { SpriteSheet } from '../SpriteSheet';
import { Collidable } from '../traits/Collidable';
import { Go } from '../traits/Go';
import { Gravity } from '../traits/Gravity';

import { Jump } from '../traits/Jump';
import { Killable } from '../traits/Killable';

import { PipeTraveller } from '../traits/PipeTraveller';
import PoleTraveller from '../traits/PoleTraveller';
import { Solid } from '../traits/Solid';

import { Stomper } from '../traits/Stomper';
import { Swim } from '../traits/Swim';
import { Turbo } from '../traits/Turbo';

export function loadMario(audioContext: AudioContext) {
  return Promise.all([loadSpriteSheet('mario'), loadAudioBoard('mario', audioContext)]).then(([sprite, audio]) => {
    return createMarioFactory(sprite, audio);
  });
}

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

function SwimRouteAnim(entity: Entity): void | string {
  const swimAnimationResolver = entity.sprite.animationManager.resolvers.get('swim') as AnimationResolver;
  const swimTrait = entity.getTrait(Swim);
  if (swimTrait?.isSwimming) {
    return swimAnimationResolver.resolveFrame(swimTrait.distance / 5);
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

  const swimTrait = entity.getTrait(Swim);

  if (swimTrait?.isSwimming) return;

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
    const poleTraveller = mario.getTrait(PoleTraveller);
    if (poleTraveller && poleTraveller.distance) {
      return false;
    }
    if (mario.getTrait(Swim) && mario.getTrait(Swim)?.isSwimming) {
      return mario.getTrait(Swim)!.heading < 0;
    }
    if (!mario.getTrait(Go)) {
      return false;
    }

    return mario.getTrait(Go)!.heading < 0;
  }

  sprite.animationManager.addRoute('pole-travelling', PoleTravellingRouteAnim);
  sprite.animationManager.addRoute('pipe-travelling', PipeTravellingRouteAnim);
  sprite.animationManager.addRoute('swimming', SwimRouteAnim);
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

    const marioCollectionTrait = new CollectionTrait(new Collidable(), new Gravity(), new Solid(), new Go(), new Turbo(), new Jump(), new Turbo(), new Stomper(), new PipeTraveller(), new PoleTraveller(), new Killable(), new Swim());

    mario.addTrait(marioCollectionTrait);

    mario.getTrait(Killable)!.removeAfter = Infinity;
    mario.getTrait(Jump)!.velocity = 175;

    mario.draw = drawMario;

    mario.useTrait(Turbo, (it) => it.setTurboState(mario, false));

    console.log(mario);

    return mario;
  };
}
