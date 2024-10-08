import { Vec2 } from './math';

export class BoundingBox {
  constructor(public pos: Vec2, public size: Vec2, public offset: Vec2) {}

  get bottom() {
    return this.pos.y + this.size.y + this.offset.y;
  }

  set bottom(y) {
    this.pos.y = y - (this.size.y + this.offset.y);
  }

  get top() {
    return this.pos.y + this.offset.y;
  }

  set top(y) {
    this.pos.y = y - this.offset.y;
  }

  get left() {
    return this.pos.x + this.offset.x;
  }

  set left(x) {
    this.pos.x = x - this.offset.x;
  }

  get right() {
    return this.pos.x + this.size.x + this.offset.x;
  }

  set right(x) {
    this.pos.x = x - (this.size.x + this.offset.x);
  }

  getCenter() {
    return new Vec2(this.pos.x + this.size.x / 2, this.pos.y + this.size.y / 2);
  }

  setCenter(vec2: Vec2) {
    this.pos.x = vec2.x - this.size.x / 2;
    this.pos.y = vec2.y - this.size.x / 2;
  }

  overlaps(box: BoundingBox) {
    return this.bottom > box.top && this.top < box.bottom && this.left < box.right && this.right > box.left;
  }
}
