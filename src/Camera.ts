import { Vec2 } from './math.js';

export default class Camera {
  pos = new Vec2(0, 0);
  // size = new Vec2(256, 240);
  size = new Vec2(256, 240);
  min = new Vec2(0, 0);
  max = new Vec2(Infinity, Infinity);
}
