import Camera from './Camera';
import { LayerFunction } from './types';

// the Compositor's responsability is to draw all layers in an order
export default class Compositor {
  layers = [] as LayerFunction[];

  // loops over all the layers and draw them
  draw(context: CanvasRenderingContext2D, camera: Camera) {
    this.layers.forEach((layer) => {
      // the layer is a function that draws on a context, it is its sole reponsability. It needs to contain all information to draw itself
      layer(context, camera);
    });
  }
}
