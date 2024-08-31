import { AudioBoard } from '../AudioBoard';
import { Entity } from '../Entity';
import { loadAudioBoard } from '../loaders/audio';
import Pole from '../traits/Pole';

export function loadFlagPole(audioContext: AudioContext) {
  return Promise.all([loadAudioBoard('flag-pole', audioContext)]).then(([audio]) => {
    return createFactory(audio);
  });
}

function createFactory(audio: AudioBoard) {
  return function createFlagPole() {
    const entity = new Entity();
    const pole = new Pole();
    entity.audio = audio;
    entity.size.set(8, 144);
    entity.offset.set(4, 0);
    entity.addTrait(pole);
    return entity;
  };
}
