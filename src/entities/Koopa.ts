import { Entity } from '../Entity.js';
import { loadSpriteSheet } from '../loaders.js';
import SpriteSheet from '../SpriteSheet.js';
import Trait from '../Trait.js';
import { Killable } from '../traits/Killable.js';
import { PendulumMove } from '../traits/PendulumMove.js';
import { Physics } from '../traits/Physics.js';
import { Solid } from '../traits/Solid.js';
import { Stomper } from '../traits/Stomper.js';

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
      us.getTrait(Killable)!.kill();
      us.vel.set(100, -200);
      us.getTrait(Solid)!.obstructs = false;
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
    const walk = us.getTrait(PendulumMove)!;
    walk.enabled = true;
    walk.speed = this.walkSpeed;
    this.state = KoopaState.walking;
  }

  panic(us: Entity, them: Entity) {
    us.getTrait(PendulumMove)!.speed = this.panicSpeed * Math.sign(them.vel.x);
    us.getTrait(PendulumMove)!.enabled = true;
    this.state = KoopaState.panic;
  }

  update(us: Entity, deltaTime: number) {
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
    if (koopa.behavior.state === KoopaState.hiding) {
      if (koopa.behavior.hideTime > 3) {
        return wakeAnim(koopa.behavior.hideTime);
      }
      return 'hiding';
    }

    if (koopa.behavior.state === KoopaState.panic) {
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
