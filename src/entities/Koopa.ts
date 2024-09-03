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

enum KoopaState {
  walking,
  hiding,
  panic,
}

class KoopaBehavior extends Trait {
  state = KoopaState.walking;
  hideTime = 0;
  hideDuration = 5;
  panicSpeed = 300;
  walkSpeed?: number;

  collides(_: GameContext, us: Entity, them: Entity) {
    if (us.getTrait(Killable)?.dead) {
      return;
    }

    const stomper = them.getTrait(Stomper);
    if (stomper) {
      if (them.vel.y > us.vel.y) {
        this.handleStomp(us, them);
      } else {
        this.handleNudge(us, them);
      }
    }
  }

  handleStomp(us: Entity, them: Entity) {
    if (this.state === KoopaState.walking) {
      this.hide(us);
    } else if (this.state === KoopaState.hiding) {
      us.useTrait(Killable, (it) => it.kill());
      us.vel.set(100, -200);
      us.useTrait(Solid, (s) => (s.obstructs = false));
    } else if (this.state === KoopaState.panic) {
      this.hide(us);
    }
  }

  handleNudge(us: Entity, them: Entity) {
    const kill = () => {
      const killable = them.getTrait(Killable);
      if (killable) {
        killable.kill();
      }
    };

    if (this.state === KoopaState.walking) {
      kill();
    } else if (this.state === KoopaState.hiding) {
      this.panic(us, them);
    } else if (this.state === KoopaState.panic) {
      const travelDir = Math.sign(us.vel.x);
      const impactDir = Math.sign(us.pos.x - them.pos.x);
      if (travelDir !== 0 && travelDir !== impactDir) {
        kill();
      }
    }
  }

  hide(us: Entity) {
    us.useTrait(PendulumMove, (walk) => {
      us.vel.x = 0;
      walk.enabled = false;

      if (!this.walkSpeed) {
        this.walkSpeed = walk.speed;
      }

      this.state = KoopaState.hiding;
      this.hideTime = 0;
    });
  }

  unhide(us: Entity) {
    us.useTrait(PendulumMove, (walk) => {
      walk.enabled = true;
      if (this.walkSpeed != null) walk.speed = this.walkSpeed;
      this.state = KoopaState.walking;
    });
  }

  panic(us: Entity, them: Entity) {
    us.useTrait(PendulumMove, (pm) => {
      pm.speed = this.panicSpeed * Math.sign(them.vel.x);
      pm.enabled = true;
    });
    this.state = KoopaState.panic;
  }

  update(us: Entity, { deltaTime }: GameContext) {
    if (this.state === KoopaState.hiding) {
      this.hideTime += deltaTime;

      if (this.hideTime > this.hideDuration) {
        this.unhide(us);
      }
    }
  }
}

function walkRouteAnim(entity: Entity): void | string {
  const walkAnimationResolver = entity.sprite.animationManager.resolvers.get('walk') as AnimationResolver;
  return walkAnimationResolver.resolveFrame(entity.lifetime);
}

function wakeRouteAnim(entity: Entity): void | string {
  const wakeAnimationResolver = entity.sprite.animationManager.resolvers.get('wake') as AnimationResolver;
  if (entity.getTrait(KoopaBehavior)!.state === KoopaState.hiding) {
    if (entity.getTrait(KoopaBehavior)!.hideTime > 3) {
      return wakeAnimationResolver.resolveFrame(entity.getTrait(KoopaBehavior)!.hideTime);
    }
    return 'hiding';
  }

  if (entity.getTrait(KoopaBehavior)!.state === KoopaState.panic) {
    return 'hiding';
  }
}

function createKoopaFactory(sprite: SpriteSheet) {
  sprite.animationManager.addAnimationRoute('wake', wakeRouteAnim);
  sprite.animationManager.addAnimationRoute('walk', walkRouteAnim);

  function drawKoopa(context: CanvasRenderingContext2D) {
    sprite.draw(sprite.animationManager.routeFrame(this), context, 0, 0, this.vel.x < 0);
  }

  return function createKoopa() {
    const koopa = new Entity();
    koopa.sprite = sprite;
    koopa.size.set(16, 16);
    koopa.offset.y = 8;

    koopa.addTrait(new Physics());
    koopa.addTrait(new Solid());
    koopa.addTrait(new PendulumMove());
    koopa.addTrait(new Killable());
    koopa.addTrait(new KoopaBehavior());

    koopa.draw = drawKoopa;

    return koopa;
  };
}

export function loadKoopaGreen() {
  return loadSpriteSheet('koopa-green').then(createKoopaFactory);
}

export function loadKoopaBlue() {
  return loadSpriteSheet('koopa-blue').then(createKoopaFactory);
}
