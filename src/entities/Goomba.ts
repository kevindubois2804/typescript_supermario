import { AnimationResolver } from '../AnimationResolver';
import { Entity } from '../Entity';
import { GameContext } from '../GameContext';
import { loadSpriteSheet } from '../loaders/sprite';
import { SpriteSheet } from '../SpriteSheet';
import { Trait } from '../Trait';
import { Killable } from '../traits/Killable';
import { PendulumMove } from '../traits/PendulumMove';
import { Physics } from '../traits/Physics';
import { Solid } from '../traits/Solid';
import { Stomper } from '../traits/Stomper';

class GoombaBehavior extends Trait {
  collides(_: GameContext, us: Entity, them: Entity) {
    if (us.getTrait(Killable)?.dead) {
      return;
    }

    const stomper = them.getTrait(Stomper);
    if (stomper) {
      if (them.vel.y > us.vel.y) {
        us.useTrait(PendulumMove, (pm) => (pm.speed = 0));
        us.useTrait(Killable, (k) => k.kill());
      } else {
        them.getTrait(Killable)?.kill();
      }
    }
  }
}

function flattenedRouteAnim(entity: Entity): void | string {
  if (entity.getTrait(Killable)!.dead) {
    return 'flat';
  }
}

function walkRouteAnim(entity: Entity): void | string {
  const walkAnimationresolver = entity.sprite.animationManager.resolvers.get('walk') as AnimationResolver;
  return walkAnimationresolver.resolveFrame(entity.lifetime);
}

function createGoombaFactory(sprite: SpriteSheet) {
  sprite.animationManager.addRoute('flat', flattenedRouteAnim);
  sprite.animationManager.addRoute('walk', walkRouteAnim);

  function drawGoomba(context: CanvasRenderingContext2D) {
    sprite.draw(sprite.animationManager.routeFrame(this), context, 0, 0);
  }

  return function createGoomba() {
    const goomba = new Entity();
    goomba.sprite = sprite;
    goomba.size.set(16, 16);

    goomba.addTrait(new Physics());
    goomba.addTrait(new Solid());
    goomba.addTrait(new PendulumMove());
    goomba.addTrait(new GoombaBehavior());
    goomba.addTrait(new Killable());

    goomba.draw = drawGoomba;

    return goomba;
  };
}

export function loadGoombaBrown() {
  return loadSpriteSheet('goomba-brown').then(createGoombaFactory);
}

export function loadGoombaBlue() {
  return loadSpriteSheet('goomba-blue').then(createGoombaFactory);
}
