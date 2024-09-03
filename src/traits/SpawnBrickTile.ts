import { Entity } from '../Entity';
import { GameContext } from '../GameContext';
import { Level } from '../Level';
import { Trait } from '../Trait';
import { InputController } from './InputController';

export default class SpawnBrickTile extends Trait {
  time: number = 2;
  shouldSpawnABrick: boolean;
  increment: number = 0;

  constructor() {
    super();

    this.listen(InputController.KEYBORD_KEY_SPACE_PRESSED, (pressed) => {
      this.shouldSpawnABrick = pressed ? true : false;
    });
  }

  update(entity: Entity, _: GameContext, level: Level) {
    if (this.shouldSpawnABrick) this.spawnABrick(level);
  }

  spawnABrick(level: Level) {
    const gridOfFirstLayer = level.tileCollider.resolvers[0].matrix;
    this.queue(() => {
      const value = gridOfFirstLayer.get(0, this.increment);
      if (value?.style === 'bricks-top') this.increment++;
      else gridOfFirstLayer.set(0, this.increment, { style: 'bricks-top', behavior: 'ground', ranges: [[0, 0]] });
    });
  }
}
