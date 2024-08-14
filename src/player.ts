import { Entity } from './Entity';
import Level from './Level';
import Player from './traits/Player';
import { PlayerController } from './traits/PlayerController';

export function createPlayerEnv(playerEntity: Entity) {
  const playerEnv = new Entity();
  const playerControl = new PlayerController();
  playerControl.checkpoint.set(64, 64);
  playerControl.setPlayer(playerEntity);
  playerEnv.addTrait(playerControl);
  return playerEnv;
}

export function createPlayer(entity: Entity) {
  entity.addTrait(new Player());
  return entity;
}

export function* findPlayers(level: Level) {
  for (const entity of level.entities) {
    if (entity.getTrait(Player)) {
      yield entity;
    }
  }
}
