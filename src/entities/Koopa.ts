import { Entity } from '../Entity.js';
import { loadSpriteSheet } from '../loaders/sprite';
import SpriteSheet from '../SpriteSheet.js';
import { Trait } from '../Trait.js';

import { Killable } from '../traits/Killable.js';
import { PendulumMove } from '../traits/PendulumMove.js';
import { Physics } from '../traits/Physics.js';
import { Solid } from '../traits/Solid.js';
import { Stomper } from '../traits/Stomper.js';
import { GameContext } from '../types.js';

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
  walkSpeed: number;

  collides(us: Entity, them: Entity) {
    if (us.getTrait(Killable)!.dead) {
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
      this.queue(() => this.hide(us));
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
    const walk = us.getTrait(PendulumMove)!;

    us.vel.x = 0;
    walk.enabled = false;

    if (!this.walkSpeed) {
      this.walkSpeed = walk.speed;
    }

    this.state = KoopaState.hiding;
    this.hideTime = 0;
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

export function loadKoopa() {
  return loadSpriteSheet('koopa').then(createKoopaFactory);
}

function createKoopaFactory(sprite: SpriteSheet) {
  const walkAnim = sprite.animations.get('walk')!;
  const wakeAnim = sprite.animations.get('wake')!;

  function routeAnim(koopa: Entity) {
    const behavior = koopa.getTrait(KoopaBehavior)!;
    if (behavior.state === KoopaState.hiding) {
      if (behavior.hideTime > 3) {
        return wakeAnim(behavior.hideTime);
      }
      return 'hiding';
    }

    if (behavior.state === KoopaState.panic) {
      return 'hiding';
    }

    return walkAnim(koopa.lifetime);
  }

  function drawKoopa(context: CanvasRenderingContext2D) {
    sprite.draw(routeAnim(this), context, 0, 0, this.vel.x < 0);
  }

  return function createKoopa() {
    const koopa = new Entity();
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
