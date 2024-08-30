import { Vec2 } from '../math';
import { Trait } from '../Trait';

export class PipeTraveller extends Trait {
  direction = new Vec2(0, 0);
  movement = new Vec2(0, 0);
  distance = new Vec2(0, 0);
}
