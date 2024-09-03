import { Entity } from '../Entity';
import { GameContext } from '../GameContext';
import { Level } from '../Level';
import { Vec2 } from '../math';
import { Trait } from '../Trait';
import PoleTraveller from './PoleTraveller';

export type PoleTravellerState = {
  current: Vec2;
  goal: Vec2;
  done: boolean;
};

function createTravellerState(): PoleTravellerState {
  return {
    current: new Vec2(),
    goal: new Vec2(),
    done: false,
  };
}

export default class Pole extends Trait {
  velocity = 100;
  travellers = new Map<Entity, PoleTravellerState>();

  addTraveller(pole: Entity, traveller: Entity) {
    pole.sounds.add('ride');

    const poleTraveller = traveller.getTrait(PoleTraveller)!;
    poleTraveller.distance = 0;

    const state = createTravellerState();
    state.current.x = pole.bounds.meridian;
    state.current.y = traveller.bounds.bottom;
    state.goal.x = state.current.x;
    state.goal.y = pole.bounds.bottom;
    this.travellers.set(traveller, state);
  }

  collides(_: GameContext, pole: Entity, traveller: Entity) {
    if (!traveller.getTrait(PoleTraveller)) {
      return;
    }

    if (this.travellers.has(traveller)) {
      return;
    }

    this.addTraveller(pole, traveller);
  }

  update(pole: Entity, gameContext: GameContext, level: Level) {
    const { deltaTime } = gameContext;
    const distance = this.velocity * deltaTime;
    for (const [traveller, state] of this.travellers.entries()) {
      if (!state.done) {
        state.current.y += distance;
        traveller.bounds.right = state.current.x;
        traveller.bounds.bottom = state.current.y;

        const poleTraveller = traveller.getTrait(PoleTraveller)!;
        poleTraveller.distance += distance;

        if (traveller.bounds.bottom > state.goal.y) {
          state.done = true;
          traveller.bounds.bottom = state.goal.y;
          poleTraveller.distance = 0;
        }
      } else if (!pole.bounds.overlaps(traveller.bounds)) {
        this.travellers.delete(traveller);
      }
    }
  }
}
