export class Vec2 {
  constructor(public x: number = 0, public y: number = 0) {}

  set(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  copy(other: Vec2) {
    this.set(other.x, other.y);
  }
}
