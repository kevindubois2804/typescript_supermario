import Camera from './Camera';
import { Entity } from './Entity';
import { Vec2 } from './math';

const mouseEvents = ['mousedown', 'mousemove'];

export function setupMouseControlForDebugPurposes(canvas: HTMLCanvasElement, entity: Entity): (...args: any[]) => void {
  let lastEvent: MouseEvent | void;
  let camera = { pos: new Vec2(0, 0) };
  mouseEvents.forEach((eventName) => {
    canvas.addEventListener(eventName, (event) => {
      if (event instanceof MouseEvent) {
        if (event.buttons === 1) {
          entity.vel.set(0, 0);
          entity.pos.set(event.offsetX - 100 + camera.pos.x, event.offsetY + camera.pos.y - 100);
        } else if (event.buttons === 2 && lastEvent && lastEvent.buttons === 2 && lastEvent.type === 'mousemove') {
          camera.pos.x -= event.offsetX - lastEvent.offsetX;
        }
        lastEvent = event;
      }
    });

    canvas.addEventListener('contextmenu', (event) => event.preventDefault());
  });

  return function updateCameraPositionsForMouseDebugging(cam: Camera) {
    camera.pos = cam.pos;
  };
}
