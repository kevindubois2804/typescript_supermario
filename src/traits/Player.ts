import { Trait } from '../Trait';
import { Stomper } from './Stomper';

export default class Player extends Trait {
  coins = 0;
  lives = 3;
  score = 0;

  constructor() {
    super();

    this.listen(Stomper.EVENT_STOMP, () => {
      this.score += 100;
    });
  }
}
