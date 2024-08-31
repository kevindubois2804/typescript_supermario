import { Animation } from '../animation';
import { Entity } from '../Entity';
import { GameContext } from '../GameContext';
import { Level } from '../Level';
import { loadSpriteSheet } from '../loaders/sprite';
import { SpriteSheet } from '../SpriteSheet';
import { Trait } from '../Trait';
import { Killable } from '../traits/Killable';

export function loadCheepSlow() {
  return loadSpriteSheet('cheep-gray').then(createCheepSlowFactory);
}

export function loadCheepSlowWavy() {
  return loadSpriteSheet('cheep-gray').then(createCheepSlowWavyFactory);
}

export function loadCheepFast() {
  return loadSpriteSheet('cheep-red').then(createCheepFastFactory);
}

export function loadCheepFastWavy() {
  return loadSpriteSheet('cheep-red').then(createCheepFastWavyFactory);
}

class CheepCheepBehavior extends Trait {
  collides(us: Entity, them: Entity) {
    if (them.traits.has(Killable)) {
      them.getTrait(Killable)!.kill();
    }
  }

  update(entity: Entity, gameContext: GameContext, level: Level) {
    const { deltaTime } = gameContext;
    entity.pos.x += entity.vel.x * deltaTime;
  }
}

class Wavy extends Trait {
  amplitude = 16;
  direction = 1;
  offset = 0;
  speed = 0.5;

  update(entity: Entity, gameContext: GameContext, level: Level) {
    const { deltaTime } = gameContext;
    const movementY = entity.vel.x * deltaTime * this.direction * this.speed;
    entity.pos.y += movementY;

    this.offset += movementY;
    if (Math.abs(this.offset) > this.amplitude) {
      this.direction = -this.direction;
    }
  }
}

function createCheepSlowFactory(sprite: SpriteSheet) {
  const swimAnim = sprite.animations.get('swim') as Animation;

  function routeAnim(entity: Entity) {
    return swimAnim(entity.lifetime);
  }

  function drawCheepSlow(context: CanvasRenderingContext2D) {
    sprite.draw(routeAnim(this), context, 0, 0, true);
  }

  return function createCheepSlow() {
    const entity = new Entity();
    entity.size.set(16, 16);
    entity.vel.x = -16;
    entity.addTrait(new CheepCheepBehavior());
    entity.draw = drawCheepSlow;

    return entity;
  };
}

function createCheepSlowWavyFactory(sprite: SpriteSheet) {
  const swimAnim = sprite.animations.get('swim') as Animation;

  function routeAnim(entity: Entity) {
    return swimAnim(entity.lifetime);
  }

  function drawCheepSlowWavy(context: CanvasRenderingContext2D) {
    sprite.draw(routeAnim(this), context, 0, 0, true);
  }

  return function createCheepSlowWavy() {
    const entity = new Entity();
    entity.size.set(16, 16);
    entity.vel.x = -16;

    entity.addTrait(new CheepCheepBehavior());
    entity.addTrait(new Wavy());

    entity.draw = drawCheepSlowWavy;

    return entity;
  };
}

function createCheepFastFactory(sprite: SpriteSheet) {
  const swimAnim = sprite.animations.get('swim') as Animation;

  function routeAnim(entity: Entity) {
    return swimAnim(entity.lifetime);
  }

  function drawCheepFast(context: CanvasRenderingContext2D) {
    sprite.draw(routeAnim(this), context, 0, 0, true);
  }

  return function createCheepFast() {
    const entity = new Entity();
    entity.size.set(16, 16);
    entity.vel.x = -32;
    entity.addTrait(new CheepCheepBehavior());
    entity.draw = drawCheepFast;

    return entity;
  };
}

function createCheepFastWavyFactory(sprite: SpriteSheet) {
  const swimAnim = sprite.animations.get('swim') as Animation;

  function routeAnim(entity: Entity) {
    return swimAnim(entity.lifetime);
  }

  function drawCheepFastWavy(context: CanvasRenderingContext2D) {
    sprite.draw(routeAnim(this), context, 0, 0, true);
  }

  return function createCheepFastWavy() {
    const entity = new Entity();
    entity.size.set(16, 16);
    entity.vel.x = -32;

    entity.addTrait(new CheepCheepBehavior());
    entity.addTrait(new Wavy());
    entity.getTrait(Wavy)!.speed = 0.25;

    entity.draw = drawCheepFastWavy;

    return entity;
  };
}
