import { Entity } from '../Entity';
import { Trait } from '../Trait';
import { Stomper } from './Stomper';

const COIN_LIFE_THRESHOLD = 100;

export default class Player extends Trait {
  name = 'UNNAMED';
  coins = 0;
  lives = 3;
  score = 0;

  constructor() {
    super();

    this.listen(Stomper.EVENT_STOMP, () => {
      this.score += 100;
    });
  }

  addCoins(count: number) {
    this.coins += count;
    if (this.coins >= COIN_LIFE_THRESHOLD) {
      const lifeCount = Math.floor(this.coins / COIN_LIFE_THRESHOLD);
      this.addLives(lifeCount);
      this.coins = this.coins % COIN_LIFE_THRESHOLD;
    }

    this.queue((entity: Entity) => {
      entity.sounds.add('coin');
    });
  }

  addLives(count: number) {
    this.lives += count;
  }
}
