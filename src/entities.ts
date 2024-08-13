import { loadMario } from './entities/Mario.js';
import { loadGoomba } from './entities/Goomba.js';
import { loadKoopa } from './entities/Koopa.js';
import { Entity } from './Entity.js';
import { loadCannon } from './entities/Cannon.js';
import { Dict } from './types.js';
import { loadBulletBill } from './entities/BulletBill.js';

export type EntityFactory = () => Entity;

export type EntityFactoryDict = Dict<EntityFactory>;

export async function loadEntities(audioContext: AudioContext): Promise<EntityFactoryDict> {
  const factories: EntityFactoryDict = {};

  const addAs = (name: string) => (factory: EntityFactory) => {
    factories[name] = factory;
  };

  await Promise.all([loadMario(audioContext).then(addAs('mario')), loadGoomba().then(addAs('goomba')), loadKoopa().then(addAs('koopa')), loadBulletBill().then(addAs('bullet')), loadCannon(audioContext, factories).then(addAs('cannon'))]);

  return factories;
}
