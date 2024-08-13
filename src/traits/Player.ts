import Trait from '../Trait';

export default class Player extends Trait {
  lives = 3;
  score = 0;
  constructor() {
    super('player');
  }
}
