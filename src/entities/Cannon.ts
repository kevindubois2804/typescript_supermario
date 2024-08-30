import { AudioBoard } from '../AudioBoard';
import { Entity } from '../Entity';
import { GameContext } from '../GameContext';
import { Level } from '../Level';
import { loadAudioBoard } from '../loaders/audio';
import { findPlayers } from '../player';
import { Emitter } from '../traits/Emitter';

const HOLD_FIRE_THRESHOLD = 30;

export function loadCannon(audioContext: AudioContext) {
  return loadAudioBoard('cannon', audioContext).then((audio) => {
    return createCannonFactory(audio);
  });
}

function createCannonFactory(audio: AudioBoard) {
  function emitBullet(cannon: Entity, gameContext: GameContext, level: Level) {
    let dir = 1;
    for (const player of findPlayers(level.entities)) {
      if (player.pos.x > cannon.pos.x - HOLD_FIRE_THRESHOLD && player.pos.x < cannon.pos.x + HOLD_FIRE_THRESHOLD) {
        return;
      }

      if (player.pos.x < cannon.pos.x) {
        dir = -1;
      }
    }

    const bullet = gameContext.entityFactory.bullet?.();

    if (!bullet) return;

    bullet.pos.copy(cannon.pos);
    bullet.vel.set(80 * dir, 0);

    cannon.sounds.add('shoot');
    level.entities.add(bullet);
  }

  return function createCannon() {
    const cannon = new Entity();
    cannon.audio = audio;

    const emitter = new Emitter();
    emitter.interval = 4;
    emitter.emitters.push(emitBullet);
    cannon.addTrait(emitter);
    return cannon;
  };
}
