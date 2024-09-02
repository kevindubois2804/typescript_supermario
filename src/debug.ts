import Camera from './Camera';
import { Entity } from './Entity';
import { OFFSET_PLAYER_FROM_CAMERA } from './Level';
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
          entity.pos.set(event.offsetX - OFFSET_PLAYER_FROM_CAMERA + camera.pos.x, event.offsetY + camera.pos.y - OFFSET_PLAYER_FROM_CAMERA);
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
