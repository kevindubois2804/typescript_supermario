import { AnimationResolver } from '../AnimationResolver';
import { AudioBoard } from '../AudioBoard';
import { Entity } from '../Entity';
import { GameContext } from '../GameContext';
import { Level } from '../Level';
import { loadAudioBoard } from '../loaders/audio';
import { loadSpriteSheet } from '../loaders/sprite';
import { SpriteSheet } from '../SpriteSheet';
import { Trait } from '../Trait';
import { Gravity } from '../traits/Gravity';
import { Killable } from '../traits/Killable';
import LifeLimit from '../traits/LifeLimit';
import { Solid } from '../traits/Solid';
import { Velocity } from '../traits/Velocity';
import { GoombaBehavior } from './Goomba';

export class BrickshrapnelBehavior extends Trait {
  update(entity: Entity, gameContext: GameContext, level: Level): void {}

  collides(_: GameContext, us: Entity, them: Entity) {
    if (us.vel.y < 0 && them.getTrait(GoombaBehavior)) {
      them.useTrait(Killable, (it) => it.kill());
      them.vel.set(100, -200);
      them.useTrait(Solid, (s) => (s.obstructs = false));
    }
  }
}

export function loadBrickShrapnel(audioContext: AudioContext) {
  return Promise.all([loadSpriteSheet('brick-shrapnel'), loadAudioBoard('brick-shrapnel', audioContext)]).then(([sprite, audio]) => {
    return createBrickShrapnelFactory(sprite, audio);
  });
}

function spinningBrickRouteAnim(entity: Entity): void | string {
  const spinBrickAnimationResolver = entity.sprite.animationManager.resolvers.get('spinning-brick') as AnimationResolver;
  return spinBrickAnimationResolver.resolveFrame(entity.lifetime);
}

function createBrickShrapnelFactory(sprite: SpriteSheet, audio: AudioBoard) {
  sprite.animationManager.addAnimationRoute('spinning-brick', spinningBrickRouteAnim);

  function draw(context: CanvasRenderingContext2D) {
    sprite.draw(sprite.animationManager.routeFrame(this), context, 0, 0);
  }

  return function createBrickShrapnel() {
    const shrapnel = new Entity();
    shrapnel.sprite = sprite;
    shrapnel.audio = audio;
    shrapnel.size.set(8, 8);
    shrapnel.addTrait(new Gravity());
    shrapnel.addTrait(new Velocity());
    shrapnel.addTrait(new LifeLimit());
    shrapnel.addTrait(new BrickshrapnelBehavior());
    shrapnel.draw = draw;
    return shrapnel;
  };
}
