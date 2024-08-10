import { Entity } from '../Entity.js';
import { loadSpriteSheet } from '../loaders.js';
import SpriteSheet from '../SpriteSheet.js';
import Trait from '../Trait.js';
import { Killable } from '../traits/Killable.js';
import { PendulumMove } from '../traits/PendulumMove.js';
import { Physics } from '../traits/Physics.js';
import { Solid } from '../traits/Solid.js';
import { Stomper } from '../traits/Stomper.js';

class GoombaBehavior extends Trait {
  constructor() {
    super('behavior');
  }

  collides(us: Entity, them: Entity) {
    if (us.getTrait(Killable)!.dead) {
      return;
    }

    const stomper = them.getTrait(Stomper);
    if (stomper) {
      if (them.vel.y > us.vel.y) {
        us.getTrait(PendulumMove)!.speed = 0;
        us.getTrait(Killable)!.kill();
      } else {
        const killable = them.getTrait(Killable);
        if (killable) {
          killable.kill();
        }
      }
    }
  }
}

export function loadGoomba() {
  return loadSpriteSheet('goomba').then(createGoombaFactory);
}

function createGoombaFactory(sprite: SpriteSheet) {
  const walkAnim = sprite.animations.get('walk')!;

  function routeAnim(goomba: Entity) {
    if (goomba.killable.dead) {
      return 'flat';
    }

    return walkAnim(goomba.lifetime);
  }

  function drawGoomba(context: CanvasRenderingContext2D) {
    sprite.draw(routeAnim(this), context, 0, 0);
  }

  return function createGoomba() {
    const goomba = new Entity();
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
