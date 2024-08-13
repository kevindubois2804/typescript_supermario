import { loadMario } from './entities/Mario.js';
import { loadGoomba } from './entities/Goomba.js';
import { loadKoopa } from './entities/Koopa.js';
import { Entity } from './Entity.js';
import { loadBulletBill } from './entities/BulletBill.js';
import { loadCannon } from './entities/Cannon.js';

export type EntityFactory = () => Entity;

export type EntityFactories = {
  [name: string]: EntityFactory;
};

export function loadEntities(audioContext: AudioContext): Promise<EntityFactories> {
  const entityFactories: EntityFactories = {};

  function addAs(name: string) {
    return (factory: EntityFactory) => (entityFactories[name] = factory);
  }

  return Promise.all([loadMario(audioContext).then(addAs('mario')), loadGoomba().then(addAs('goomba')), loadKoopa().then(addAs('koopa')), loadBulletBill().then(addAs('bullet')), loadCannon(audioContext, entityFactories).then(addAs('cannon'))]).then(() => entityFactories);
}
