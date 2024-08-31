import { loadBrickShrapnel } from './entities/BrickShrapnel';
import { loadBullet } from './entities/Bullet';
import { loadCannon } from './entities/Cannon';
import { loadCheepFast, loadCheepFastWavy, loadCheepSlow, loadCheepSlowWavy } from './entities/CheepCheep';
import { loadFlagPole } from './entities/FlagPole';
import { loadGoombaBlue, loadGoombaBrown } from './entities/Goomba';
import { loadKoopaBlue, loadKoopaGreen } from './entities/Koopa';
import { loadMario } from './entities/Mario';
import { loadPipePortal } from './entities/PipePortal';
import { loadPiranhaPlant } from './entities/PiranhaPlant';
import { Entity } from './Entity';
import { Dict } from './types';

export type EntityFactory = (...args: any[]) => Entity;

export type EntityFactoryDict = Dict<EntityFactory>;

export type EntityLoaderFunc = (audioContext: AudioContext) => Promise<EntityFactory>;

function createPool(size: number) {
  const pool: Entity[] = [];

  return function createPooledFactory(factory: EntityFactory) {
    for (let i = 0; i < size; i++) {
      pool.push(factory());
    }

    let count = 0;
    return function pooledFactory() {
      const entity = pool[count++ % pool.length];
      entity.lifetime = 0;
      return entity;
    };
  };
}

export async function loadEntities(audioContext: AudioContext) {
  const entityFactories: EntityFactoryDict = {};
  function addAs(name: string) {
    return (factory: EntityFactory) => (entityFactories[name] = factory);
  }

  function setup(loader: EntityLoaderFunc) {
    return loader(audioContext);
  }

  await Promise.all([setup(loadMario).then(addAs('mario')), setup(loadPiranhaPlant).then(addAs('piranha-plant')), setup(loadGoombaBrown).then(addAs('goomba-brown')), setup(loadGoombaBlue).then(addAs('goomba-blue')), setup(loadKoopaGreen).then(addAs('koopa-green')), setup(loadKoopaBlue).then(addAs('koopa-blue')), setup(loadCheepSlow).then(addAs('cheep-slow')), setup(loadCheepFast).then(addAs('cheep-fast')), setup(loadCheepSlowWavy).then(addAs('cheep-slow-wavy')), setup(loadCheepFastWavy).then(addAs('cheep-fast-wavy')), setup(loadBullet).then(addAs('bullet')), setup(loadCannon).then(addAs('cannon')), setup(loadBrickShrapnel).then(createPool(8)).then(addAs('brick-shrapnel')), setup(loadPipePortal).then(addAs('pipe-portal')), setup(loadFlagPole).then(addAs('flag-pole'))]);

  return entityFactories;
}
