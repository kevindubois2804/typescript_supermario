import { Entity } from '../Entity';
import { Level } from '../Level';
import { Font } from '../loaders/font';
import { findPlayers } from '../player';
import { LevelTimer } from '../traits/LevelTimer';
import Player from '../traits/Player';

function getPlayer(entities: Set<Entity>) {
  for (const entity of findPlayers(entities)) {
    return entity;
  }
}

export function createDashboardLayer(font: Font, level: Level) {
  const LINE1 = font.size * 2;
  const LINE2 = font.size * 3;

  return function drawDashboard(context: CanvasRenderingContext2D) {
    const entity = getPlayer(level.entities)!;
    const playerTrait = entity.getTrait(Player)!;
    const timerTrait = entity.getTrait(LevelTimer)!;

    font.print(playerTrait.name, context, 24, LINE1);
    font.print(playerTrait.score.toString().padStart(6, '0'), context, 24, LINE2);

    font.print('×' + playerTrait.coins.toString().padStart(2, '0'), context, 96, LINE2);

    font.print('WORLD', context, 144, LINE1);
    font.print(level.name, context, 152, LINE2);

    font.print('TIME', context, 200, LINE1);
    font.print(timerTrait.currentTime.toFixed().toString().padStart(3, '0'), context, 208, LINE2);
  };
}
