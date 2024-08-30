import { Entity } from './Entity';
import { Level } from './Level';
import { LevelTimer } from './traits/LevelTimer';
import Player from './traits/Player';

export function* findPlayers(entities: Iterable<Entity>) {
  for (const entity of entities) {
    if (entity.getTrait(Player)) yield entity;
  }
}

export function makePlayer(entity: Entity, name: string) {
  const player = new Player();
  player.name = name;
  entity.addTrait(player);

  const timer = new LevelTimer();
  entity.addTrait(timer);
}

export function resetPlayer(entity: Entity, worldName: string) {
  entity.getTrait(LevelTimer)!.reset();
  entity.getTrait(Player)!.world = worldName;
}

export function bootstrapPlayer(entity: Entity, level: Level) {
  entity.getTrait(LevelTimer)!.hurryEmitted = null;
  entity.pos.copy(level.checkpoints[0]);
  level.entities.add(entity);
}
