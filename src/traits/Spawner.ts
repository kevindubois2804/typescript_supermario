import { Entity } from '../Entity';
import { GameContext } from '../GameContext';
import { Level } from '../Level';
import { Trait } from '../Trait';

export class Spawner extends Trait {
  entities: Entity[] = [];
  offsetX: number = 64;

  addEntity(entity: Entity) {
    this.entities.push(entity);
    this.entities.sort((a, b) => (a.pos.x < b.pos.x ? -1 : 1));
  }

  update(entity: Entity, gameContext: GameContext, level: Level) {
    const cameraMaxX = level.camera.pos.x + level.camera.size.x + this.offsetX;
    while (this.entities[0]) {
      if (cameraMaxX > this.entities[0].pos.x && cameraMaxX < this.entities[0].pos.x + level.camera.size.x) {
        console.log(cameraMaxX);
        level.entities.add(this.entities.shift() as Entity);
      } else {
        break;
      }
    }
  }
}
