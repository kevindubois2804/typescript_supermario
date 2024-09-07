import { Entity } from '../Entity';
import { GameContext } from '../GameContext';
import { Level } from '../Level';
import { Trait } from '../Trait';
import { Utils } from '../utilities/Utils';
import { InputController } from './InputController';

export class MarioSpawnsGoombaWhileJumping extends Trait {
  shouldSpawnAGoomba: boolean;
  constructor() {
    super();

    this.listen(InputController.KEYBORD_KEY_SPACE_PRESSED, (pressed) => {
      if (pressed) {
        this.shouldSpawnAGoomba = true;
      } else {
        this.shouldSpawnAGoomba = false;
      }
    });
  }

  update(entity: Entity, gameContext: GameContext, level: Level): void {
    if (this.shouldSpawnAGoomba)
      this.queue(() => {
        const goombaBrownFactory = gameContext.entityFactory['goomba-brown'];
        if (!goombaBrownFactory) throw new Error(`Goomba factory does not exist`);
        const goomba = goombaBrownFactory();
        goomba.id = Utils.generateId();
        goomba.pos.x = entity.pos.x - 20;
        goomba.pos.y = entity.pos.y + 10;
        level.entities.add(goomba);
      });
  }
}
