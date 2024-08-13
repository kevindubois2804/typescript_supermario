import { Entity } from '../Entity';
import Level from '../Level';
import { loadSpriteSheet } from '../loaders/sprite';
import SpriteSheet from '../SpriteSheet';
import Trait from '../Trait';
import { Gravity } from '../traits/Gravity';
import { Killable } from '../traits/Killable';
import { Velocity } from '../traits/Velocity';
import { GameContext } from '../types';

export function loadBulletBill() {
  return loadSpriteSheet('bullet-bill').then(createBulletBillFactory);
}

class BulletBillBehavior extends Trait {
  gravity = new Gravity();
  constructor() {
    super('behavior');
  }

  collides(us: Entity, them: Entity) {
    if (us.killable.dead) {
      return;
    }

    if (them.stomper) {
      if (them.vel.y > us.vel.y) {
        us.killable.kill();
        us.vel.set(100, -200);
      } else {
        them.killable.kill();
      }
    }
  }

  update(us: Entity, gameContext: GameContext, level: Level) {
    if (us.killable.dead) {
      this.gravity.update(us, gameContext, level);
    }
  }
}

function createBulletBillFactory(sprite: SpriteSheet) {
  function drawBulletBill(context: CanvasRenderingContext2D) {
    sprite.draw('bullet', context, 0, 0, this.vel.x < 0);
  }

  return function createBulletBill() {
    const bullet = new Entity();
    bullet.size.set(16, 14);

    bullet.addTrait(new Velocity());
    bullet.addTrait(new Killable());
    bullet.addTrait(new BulletBillBehavior());

    bullet.draw = drawBulletBill;

    return bullet;
  };
}
