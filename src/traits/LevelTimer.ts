import { Entity } from '../Entity';
import { GameContext } from '../GameContext';
import { Level } from '../Level';
import { Trait } from '../Trait';

export class LevelTimer extends Trait {
  static EVENT_TIMER_HURRY = Symbol('timer hurry');
  static EVENT_TIMER_OK = Symbol('timer ok');

  totalTime = 400;
  currentTime = this.totalTime;
  hurryTime = 100;
  hurryEmitted?: boolean | null;

  reset() {
    this.currentTime = this.totalTime;
  }

  update(entity: Entity, { deltaTime }: GameContext, level: Level) {
    this.currentTime -= deltaTime * 2.5;

    if (!level.getMarkSymbol()) {
      this.hurryEmitted = null;
    }

    if (this.hurryEmitted !== true && this.currentTime < this.hurryTime) {
      level.events.emit(LevelTimer.EVENT_TIMER_HURRY);
      this.hurryEmitted = true;
    }

    if (this.hurryEmitted !== false && this.currentTime > this.hurryTime) {
      level.events.emit(LevelTimer.EVENT_TIMER_OK);
      this.hurryEmitted = false;
    }

    level.setMarkSymbol(true);
  }
}
