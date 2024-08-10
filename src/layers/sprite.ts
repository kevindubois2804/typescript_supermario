import Camera from '../Camera';
import { Entity } from '../Entity';
import { raise } from '../raise';
import { LayerFunction } from '../types';

// high order function that returns a function that will be responsible to draw a buffered canvas on which a sprite is drawn
export function createSpriteLayer(entities: Set<Entity>, width: number = 64, height: number = 64): LayerFunction {
  const spriteBuffer = document.createElement('canvas') as HTMLCanvasElement;
  spriteBuffer.width = width;
  spriteBuffer.height = height;

  const spriteBufferContext = spriteBuffer.getContext('2d') || raise('Canvas not supported');

  return function drawSpriteLayer(context: CanvasRenderingContext2D, camera: Camera) {
    entities.forEach((entity) => {
      spriteBufferContext.clearRect(0, 0, width, height);
      entity.draw(spriteBufferContext);
      context.drawImage(spriteBuffer, entity.pos.x - camera.pos.x, entity.pos.y - camera.pos.y);
    });
  };
}
