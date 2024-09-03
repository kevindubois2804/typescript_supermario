import { Entity } from '../Entity';
import { GameContext } from '../GameContext';
import { Level } from '../Level';
import { Vec2 } from '../math';
import { Trait } from '../Trait';
import { Go } from './Go';
import { Gravity } from './Gravity';
import { InputController } from './InputController';
import { Jump } from './Jump';

export class Swim extends Trait {
  dir = 0;
  acceleration = new Vec2(200, 200);
  distance = 0;
  heading = 1;
  dragFactor = 1 / 5000;
  deceleration = new Vec2(300, 800);
  static ENTITY_SWIMMING = Symbol('entity is swimming');

  isSwimming: boolean = false;

  isActive: boolean = true;

  observers = [Jump, Go, Gravity];

  constructor() {
    super();
    this.listen(InputController.KEYBORD_KEY_RIGHT_PRESSED, (leftState, rightState) => {
      if (!this.isActive) return;
      this.dir = rightState - leftState;
      this.heading = this.dir;
    });
    this.listen(InputController.KEYBORD_KEY_LEFT_PRESSED, (leftState, rightState) => {
      if (!this.isActive) return;
      this.dir = rightState - leftState;
      this.heading = this.dir;
    });
    this.listen(InputController.KEYBORD_KEY_DOWN_PRESSED, (upState, downState) => {
      if (!this.isActive) return;
      this.dir = downState - upState;
    });
    this.listen(InputController.KEYBORD_KEY_UP_PRESSED, (upState, downState) => {
      if (!this.isActive) return;
      this.dir = downState - upState;
    });
  }

  update(entity: Entity, { deltaTime }: GameContext, level: Level): void {
    if (!this.isActive) return;

    this.observe(entity);

    this.flag = this.isSwimming;

    if (!this.isSwimming) return;

    const absX = Math.abs(entity.vel.x);
    const absY = Math.abs(entity.vel.y);

    if (this.dir !== 0) {
      entity.vel.x += this.acceleration.x * this.dir * deltaTime;
      entity.vel.y += this.acceleration.y * this.dir * deltaTime;
    } else if (entity.vel.x !== 0) {
      const decelX = Math.min(absX, this.deceleration.x * deltaTime);
      entity.vel.x += -Math.sign(entity.vel.x) * decelX;
    } else if (entity.vel.y !== 0) {
      const decelY = Math.min(absX, this.deceleration.y * deltaTime);
      entity.vel.y += -Math.sign(entity.vel.x) * decelY;
    } else {
      this.distance = 0;
    }
    const dragX = this.dragFactor * entity.vel.x * absX;
    const dragY = this.dragFactor * entity.vel.x * absY;

    entity.vel.x -= dragX;
    entity.vel.y -= dragY;

    this.distance += ((absX + absY) * deltaTime) / 2;
  }
}
