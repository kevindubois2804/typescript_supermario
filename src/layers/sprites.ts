import Camera from '../Camera';
import { Entity } from '../Entity';
import { raise } from '../raise';

export function createSpriteLayer(entities: Set<Entity>, width = 64, height = 64) {
  const spriteBuffer = document.createElement('canvas');
  spriteBuffer.width = width;
  spriteBuffer.height = height;

  const spriteBufferContext = spriteBuffer.getContext('2d') || raise('Canvas not supported');

  return function drawSpriteLayer(context: CanvasRenderingContext2D, camera: Camera) {
    entities.forEach((entity) => {
      if (!entity.draw) {
        return;
      }
      spriteBufferContext.clearRect(0, 0, width, height);

      entity.draw(spriteBufferContext);

      context.drawImage(spriteBuffer, Math.floor(entity.pos.x - camera.pos.x), Math.floor(entity.pos.y - camera.pos.y));
    });
  };
}
