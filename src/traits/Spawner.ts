import { Entity, TraitConstructor } from '../Entity';
import { EntityCollection } from '../EntityCollection';
import { GameContext } from '../GameContext';
import { Level } from '../Level';
import { Trait } from '../Trait';
import { Trigger } from './Trigger';
import { UpdateScheduler } from './UpdateScheduler';

export class Spawner extends Trait {
  entities = new EntityCollection();
  offsetX = 64;

  static SHOULD_UPDATE: boolean = true;

  addEntityToSpawner(entity: Entity) {
    this.entities.add(entity);
  }

  update(entity: Entity, gameContext: GameContext, level: Level) {
    if (!Spawner.SHOULD_UPDATE) return;

    console.log("i'm updating !!");

    const cameraMaxX = level.camera.pos.x + level.camera.size.x + this.offsetX;
    const cameraMinX = level.camera.pos.x - this.offsetX;

    label: for (let entity of level.entities) {
      for (let TraitClass of TRAITS_TO_IGNORE_BY_SPAWNER) if (entity.getTrait(TraitClass)) continue label;
      if (cameraMaxX < entity.pos.x || cameraMinX > entity.pos.x) {
        moveEntityCollectionSetElementToAnother(entity.id, level.entities, this.entities);
      } else {
        moveEntityCollectionSetElementToAnother(entity.id, this.entities, level.entities);
      }
    }

    for (let entity of this.entities) {
      if (cameraMaxX < entity.pos.x || cameraMinX > entity.pos.x) {
        moveEntityCollectionSetElementToAnother(entity.id, level.entities, this.entities);
      } else {
        moveEntityCollectionSetElementToAnother(entity.id, this.entities, level.entities);
      }
    }
  }
}

type TraitsToIgnore = Spawner | Trigger | UpdateScheduler;

// ts-ignore
const TRAITS_TO_IGNORE_BY_SPAWNER = new Set<TraitConstructor<TraitsToIgnore>>([Spawner, Trigger, UpdateScheduler]);

function moveEntityCollectionSetElementToAnother(entityId: number, from: EntityCollection, to: EntityCollection) {
  const entityToAddToTheOtherSet = from.get(entityId);
  if (!entityToAddToTheOtherSet) return;
  to.add(entityToAddToTheOtherSet);
  from.delete(entityToAddToTheOtherSet);
}
