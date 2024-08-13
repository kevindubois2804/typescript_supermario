import { AudioBoard } from '../AudioBoard';
import { EntityFactoryDict } from '../entities';
import { Entity } from '../Entity';
import Level from '../Level';
import { loadAudioBoard } from '../loaders/audio';
import { findPlayers } from '../player';
import { Emitter } from '../traits/Emitter';

const HOLD_FIRE_THRESHOLD = 30;

export function loadCannon(audioContext: AudioContext, entityFactories: EntityFactoryDict) {
  return loadAudioBoard('cannon', audioContext).then((audio) => {
    return createCannonFactory(audio, entityFactories);
  });
}

function createCannonFactory(audio: AudioBoard, entityFactories: EntityFactoryDict) {
  function emitBullet(cannon: Entity, level: Level) {
    let dir = 1;
    for (const player of findPlayers(level)) {
      if (player.pos.x > cannon.pos.x - HOLD_FIRE_THRESHOLD && player.pos.x < cannon.pos.x + HOLD_FIRE_THRESHOLD) {
        return;
      }

      if (player.pos.x < cannon.pos.x) {
        dir = -1;
      }
    }

    const bullet = entityFactories.bullet?.();

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
