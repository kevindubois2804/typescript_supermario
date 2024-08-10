import Camera from '../Camera';

// we can send in the same camera or draw another camera from another camera perspective
export function createCameraLayer(cameraToDraw: Camera) {
  return function drawCameraRect(context: CanvasRenderingContext2D, fromCamera: Camera) {
    context.strokeStyle = 'purple';
    context.beginPath();
    context.rect(cameraToDraw.pos.x - fromCamera.pos.x, cameraToDraw.pos.y - fromCamera.pos.y, cameraToDraw.size.x, cameraToDraw.size.y);
    context.stroke();
  };
}
