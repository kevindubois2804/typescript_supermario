import { Entity } from '../Entity';
import { GameContext } from '../GameContext';
import { Level } from '../Level';
import { loadSpriteSheet } from '../loaders/sprite';
import { SpriteSheet } from '../SpriteSheet';
import { Trait } from '../Trait';
import { Gravity } from '../traits/Gravity';
import { Killable } from '../traits/Killable';
import { Stomper } from '../traits/Stomper';
import { Velocity } from '../traits/Velocity';

class BulletBehavior extends Trait {
  gravity = new Gravity();

  collides(_: GameContext, us: Entity, them: Entity) {
    if (us.getTrait(Killable)?.dead) {
      return;
    }

    const stomper = them.getTrait(Stomper);
    if (stomper) {
      if (them.vel.y > us.vel.y) {
        us.getTrait(Killable)?.kill();
        us.vel.set(100, -200);
      } else {
        them.getTrait(Killable)?.kill();
      }
    }
  }

  update(entity: Entity, gameContext: GameContext, level: Level) {
    if (entity.getTrait(Killable)?.dead) {
      this.gravity.update(entity, gameContext, level);
    }
  }
}

export function loadBullet() {
  return loadSpriteSheet('bullet').then(createBulletFactory);
}

function createBulletFactory(sprite: SpriteSheet) {
  function drawBullet(context: CanvasRenderingContext2D) {
    sprite.draw('bullet', context, 0, 0, this.vel.x > 0);
  }

  return function createBullet() {
    const bullet = new Entity();
    bullet.size.set(16, 14);

    bullet.addTrait(new Velocity());
    bullet.addTrait(new BulletBehavior());
    bullet.addTrait(new Killable());

    bullet.draw = drawBullet;

    return bullet;
  };
}
