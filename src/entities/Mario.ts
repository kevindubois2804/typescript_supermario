import { AnimationResolver } from '../AnimationResolver';
import { AudioBoard } from '../AudioBoard';

import { Entity } from '../Entity';
import { loadAudioBoard } from '../loaders/audio';
import { loadSpriteSheet } from '../loaders/sprite';
import { SpriteSheet } from '../SpriteSheet';
import { Collidable } from '../traits/Collidable';
import { Go } from '../traits/Go';
import { Gravity } from '../traits/Gravity';

import { Jump } from '../traits/Jump';
import { Killable } from '../traits/Killable';
import { MarioSpawnsGoombaWhileJumping } from '../traits/MarioSpawnsGoombaWhileJumping';

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

function SwimRouteHead(entity: Entity): void | boolean {
  if (entity.getTrait(Swim) && entity.getTrait(Swim)?.isSwimming) {
    return entity.getTrait(Swim)!.heading < 0;
  }
}

function PoleTravellingRouteAnim(entity: Entity): void | string {
  const climbAnimationResolver = entity.sprite.animationManager.resolvers.get('climb') as AnimationResolver;
  const poleTraveller = entity.getTrait(PoleTraveller)!;
  if (poleTraveller.distance) {
    return climbAnimationResolver.resolveFrame(poleTraveller.distance);
  }
}

function PoleTravellingRouteHead(entity: Entity): void | boolean {
  const poleTraveller = entity.getTrait(PoleTraveller);
  if (poleTraveller && poleTraveller.distance) {
    return false;
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

function MovingRouteHead(entity: Entity): void | boolean {
  const go = entity.getTrait(Go);
  if (go) return entity.getTrait(Go)!.heading < 0;
}

function createMarioFactory(sprite: SpriteSheet, audio: AudioBoard) {
  sprite.animationManager.addAnimationRoute('pole-anim', PoleTravellingRouteAnim);
  sprite.animationManager.addAnimationRoute('pipe-anim', PipeTravellingRouteAnim);
  sprite.animationManager.addAnimationRoute('swimming-anim', SwimRouteAnim);
  sprite.animationManager.addAnimationRoute('jumping-anim', JumpRouteAnim);
  sprite.animationManager.addAnimationRoute('moving-anim', MovingRouteAnim);

  sprite.animationManager.addHeadingRoute('pole-head', PoleTravellingRouteHead);
  sprite.animationManager.addHeadingRoute('swim-head', SwimRouteHead);
  sprite.animationManager.addHeadingRoute('moving-head', MovingRouteHead);

  sprite.animationManager.setDefaultAnimName('idle');

  function drawMario(context: CanvasRenderingContext2D) {
    sprite.draw(sprite.animationManager.routeFrame(this), context, 0, 0, sprite.animationManager.routeHeading(this));
  }

  return function createMario() {
    const mario = new Entity();
    mario.sprite = sprite;
    mario.audio = audio;
    mario.size.set(14, 16);

    // const marioCollectionTrait = new CollectionTrait(new Collidable(), new Gravity(), new Solid(), new Go(), new Turbo(), new Jump(), new Turbo(), new Stomper(), new PipeTraveller(), new PoleTraveller(), new Killable(), new Swim());

    mario.addTrait(new Collidable());
    mario.addTrait(new Gravity());
    mario.addTrait(new Solid());
    mario.addTrait(new Go());
    mario.addTrait(new Turbo());
    mario.addTrait(new Jump());
    mario.addTrait(new Stomper());
    mario.addTrait(new PipeTraveller());
    mario.addTrait(new PoleTraveller());
    mario.addTrait(new Killable());
    mario.addTrait(new Swim());
    mario.addTrait(new MarioSpawnsGoombaWhileJumping());

    mario.getTrait(Killable)!.removeAfter = Infinity;
    mario.getTrait(Jump)!.velocity = 175;

    mario.draw = drawMario;

    mario.useTrait(Turbo, (it) => it.setTurboState(mario, false));

    console.log(mario);

    return mario;
  };
}
