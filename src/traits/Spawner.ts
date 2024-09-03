import { Entity } from '../Entity';
import { EntityCollection } from '../EntityCollection';
import { GameContext } from '../GameContext';
import { Level } from '../Level';
import { Trait } from '../Trait';
import { Trigger } from './Trigger';

export class Spawner extends Trait {
  entities = new EntityCollection();
  offsetX = 64;

  addEntityToSpawner(entity: Entity) {
    this.entities.add(entity);
  }

  addEntityToLevel(level: Level, entityID: number) {
    const entityToAddToLevel = this.entities.get(entityID);
    if (!entityToAddToLevel) return;
    level.entities.add(entityToAddToLevel);
    this.entities.delete(entityToAddToLevel);
  }

  removeEntityFromLevel(level: Level, entityID: number) {
    const entityToRemoveFromLevel = level.entities.get(entityID);
    if (!entityToRemoveFromLevel) return;
    this.entities.add(entityToRemoveFromLevel);
    level.entities.delete(entityToRemoveFromLevel);
  }

  update(entity: Entity, gameContext: GameContext, level: Level) {
    const cameraMaxX = level.camera.pos.x + level.camera.size.x + this.offsetX;
    const cameraMinX = level.camera.pos.x - this.offsetX;

    for (let entity of level.entities) {
      if (entity.getTrait(Spawner) || entity.getTrait(Trigger)) {
        continue;
      }
      if (cameraMaxX < entity.pos.x || cameraMinX > entity.pos.x) {
        this.removeEntityFromLevel(level, entity.id);
      } else {
        this.addEntityToLevel(level, entity.id);
      }
    }

    for (let entity of this.entities) {
      if (cameraMaxX < entity.pos.x || cameraMinX > entity.pos.x) {
        this.removeEntityFromLevel(level, entity.id);
      } else {
        this.addEntityToLevel(level, entity.id);
      }
    }
  }
}
