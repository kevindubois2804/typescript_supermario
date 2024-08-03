import { LevelData } from './types';

export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const image = new Image();
    image.addEventListener('load', () => {
      resolve(image);
    });
    image.src = url;
  });
}

export function loadLevel(name: string) {
  return loadJSON<LevelData>(`/levels/${name}.json`);
}

export function loadJSON<T>(url: string): Promise<T> {
  return fetch(url).then((res) => res.json());
}
