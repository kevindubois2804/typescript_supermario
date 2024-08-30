import { Entity } from './Entity';

export class EntityCollection extends Set<Entity> {
  get(id: number) {
    for (const entity of this) {
      if (entity.id === id) {
        return entity;
      }
    }
  }
}
