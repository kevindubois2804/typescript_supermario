import { Animation } from '../animation';
import { AudioBoard } from '../AudioBoard';
import { Entity } from '../Entity';
import { loadAudioBoard } from '../loaders/audio';
import { loadSpriteSheet } from '../loaders/sprite';
import { SpriteSheet } from '../SpriteSheet';
import { Gravity } from '../traits/Gravity';
import LifeLimit from '../traits/LifeLimit';
import { Velocity } from '../traits/Velocity';

export function loadBrickShrapnel(audioContext: AudioContext) {
  return Promise.all([loadSpriteSheet('brick-shrapnel'), loadAudioBoard('brick-shrapnel', audioContext)]).then(([sprite, audio]) => {
    return createBrickShrapnelFactory(sprite, audio);
  });
}

function createBrickShrapnelFactory(sprite: SpriteSheet, audio: AudioBoard) {
  const spinBrick = sprite.animations.get('spinning-brick') as Animation;

  function draw(context: CanvasRenderingContext2D) {
    sprite.draw(spinBrick(this.lifetime), context, 0, 0);
  }

  return function createBrickShrapnel() {
    const shrapnel = new Entity();
    shrapnel.audio = audio;
    shrapnel.size.set(8, 8);
    shrapnel.addTrait(new Gravity());
    shrapnel.addTrait(new Velocity());
    shrapnel.addTrait(new LifeLimit());
    shrapnel.draw = draw;
    return shrapnel;
  };
}
