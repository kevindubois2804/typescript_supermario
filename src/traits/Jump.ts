import { Entity } from '../Entity';
import Trait from '../Trait';

export default class Jump extends Trait {
  duration: number = 0.5;
  velocity: number = 200;
  engageTime: number = 0;

  constructor() {
    super('jump');
  }

  start() {
    this.engageTime = this.duration;
  }

  cancel() {
    this.engageTime = 0;
  }

  update(entity: Entity, deltaTime: number) {
    if (this.engageTime > 0) {
      entity.vel.y = -this.velocity;
      this.engageTime -= deltaTime;
    }
  }
}
