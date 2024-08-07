import { loadMario } from './entities/Mario.js';
import { loadGoomba } from './entities/Goomba.js';
import { loadKoopa } from './entities/Koopa.js';
import { Entity } from './Entity.js';

export type EntityFactory = () => Entity;

export type EntityFactories = {
  [name: string]: EntityFactory;
};

export function loadEntities(): Promise<EntityFactories> {
  const entityFactories: EntityFactories = {};

  function addAs(name: string) {
    return (factory: EntityFactory) => (entityFactories[name] = factory);
  }

  return Promise.all([loadMario().then(addAs('mario')), loadGoomba().then(addAs('goomba')), loadKoopa().then(addAs('koopa'))]).then(() => entityFactories);
}
