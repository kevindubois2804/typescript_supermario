import { Level } from '../Level';
import { Font } from '../loaders/font';
import { findPlayers } from '../player';
import { LevelTimer } from '../traits/LevelTimer';
import Player from '../traits/Player';

function getPlayerTrait(level: Level) {
  for (const entity of findPlayers(level.entities)) {
    const trait = entity.getTrait(Player);
    if (trait) return trait;
  }
}

function getTimerTrait(level: Level) {
  for (const entity of level.entities) {
    const trait = entity.getTrait(LevelTimer);
    if (trait) return trait;
  }
}

export function createDashboardLayer(font: Font, level: Level) {
  const line1 = font.size * 2;
  const line2 = font.size * 3;

  return function drawDashboard(context: CanvasRenderingContext2D) {
    const player = getPlayerTrait(level);
    if (player) {
      font.print(player.name, context, 24, line1);
      font.print(String(player.score).padStart(6, '0'), context, 24, line2);

      font.print('x' + String(player.coins).padStart(2, '0'), context, 88, line2);
    }

    font.print(`WORLD`, context, 136, line1);
    font.print(level.name.toUpperCase(), context, 144, line2);

    const timer = getTimerTrait(level);
    if (timer) {
      font.print('TIME', context, 200, line1);
      font.print(String(Math.floor(timer.currentTime)).padStart(3, '0'), context, 208, line2);
    }
  };
}
