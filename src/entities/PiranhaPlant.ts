import { Entity } from '../Entity';
import { GameContext } from '../GameContext';
import { Level } from '../Level';
import { loadSpriteSheet } from '../loaders/sprite';
import { findPlayers } from '../player';
import { SpriteSheet } from '../SpriteSheet';
import { Trait } from '../Trait';

export function loadPiranhaPlant() {
  return loadSpriteSheet('piranha-plant').then(createPiranhaPlantFactory);
}

class PiranhaPlantBehavior extends Trait {
  graceDistance = 32;

  idleTime = 4;
  idleCounter: number | null = 0;
  attackTime = 2;
  attackCounter: number | null = null;
  holdTime = 2;
  holdCounter: number | null = null;
  retreatTime = 2;
  retreatCounter: number | null = null;

  velocity = 30;
  deltaMove = 0;

  update(entity: Entity, gameContext: GameContext, level: Level) {
    const { deltaTime } = gameContext;

    if (this.idleCounter !== null) {
      for (const player of findPlayers(level.entities)) {
        const distance = player.bounds.getCenter().distance(entity.bounds.getCenter());
        if (distance < this.graceDistance) {
          this.idleCounter = 0;
          return;
        }
      }

      this.idleCounter += deltaTime;
      if (this.idleCounter >= this.idleTime) {
        this.attackCounter = 0;
        this.idleCounter = null;
      }
    } else if (this.attackCounter !== null) {
      this.attackCounter += deltaTime;
      const movement = this.velocity * deltaTime;
      this.deltaMove += movement;
      entity.pos.y -= movement;
      if (this.deltaMove >= entity.size.y) {
        entity.pos.y += entity.size.y - this.deltaMove;
        this.attackCounter = null;
        this.holdCounter = 0;
      }
    } else if (this.holdCounter !== null) {
      this.holdCounter += deltaTime;
      if (this.holdCounter >= this.holdTime) {
        this.retreatCounter = 0;
        this.holdCounter = null;
      }
    } else if (this.retreatCounter !== null) {
      this.retreatCounter += deltaTime;
      const movement = this.velocity * deltaTime;
      this.deltaMove -= movement;
      entity.pos.y += movement;
      if (this.deltaMove <= 0) {
        entity.pos.y -= this.deltaMove;
        this.retreatCounter = null;
        this.idleCounter = 0;
      }
    }
  }
}

function createPiranhaPlantFactory(sprite: SpriteSheet) {
  const chewAnim = sprite.animations.get('chew')!;

  function routeAnim(entity: Entity) {
    return chewAnim(entity.lifetime);
  }

  function drawPiranhaPlant(context: CanvasRenderingContext2D) {
    sprite.draw(routeAnim(this), context, 0, 0);
  }

  return function createPiranhaPlant() {
    const entity = new Entity();
    entity.size.set(16, 24);

    entity.addTrait(new PiranhaPlantBehavior());

    entity.draw = drawPiranhaPlant;

    return entity;
  };
}
