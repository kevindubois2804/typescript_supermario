export default class SpriteSheet {
  tiles = new Map<string, HTMLCanvasElement>();
  constructor(public image: HTMLImageElement, public width: number, public height: number) {}

  define(name: string, x: number, y: number, width: number, height: number): void {
    // we want to save the subset of the image to a buffer
    // for that we first create the buffer
    // the buffer is to be differentiated to the main canvas element selected by id. Here we create it programatically, whereas main canvas is created by browser on initial page load
    const buffer = document.createElement('canvas') as HTMLCanvasElement;

    // we want to set the width and height of this canvas buffer
    buffer.width = width;
    buffer.height = height;

    // next we draw the subset of the image on this buffer
    buffer.getContext('2d')?.drawImage(this.image, x, y, width, height, 0, 0, width, height);

    // once we have drawn the image on this buffer we want to save this buffer in a Map
    this.tiles.set(name, buffer);
  }

  defineTile(name: string, x: number, y: number) {
    this.define(name, x * this.width, y * this.height, this.width, this.height);
  }

  // draw a buffer
  draw(name: string, context: CanvasRenderingContext2D, x: number, y: number): void {
    // first we retrieve the buffer from the tiles set
    const buffer = this.tiles.get(name);
    // we throw an error if the buffer isn't found in the tiles set
    if (!buffer) {
      throw new Error(`SpriteSheet.draw(): Sprite "${name}" not found`);
    }
    // we draw the buffer at coordinates x and y
    context.drawImage(buffer, x, y);
  }

  // convenient method to draw a buffer while taking into account tile sizes
  drawTile(name: string, context: CanvasRenderingContext2D, x: number, y: number): void {
    this.draw(name, context, x * this.width, y * this.height);
  }
}
