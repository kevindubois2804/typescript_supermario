import { Entity, TraitConstructor } from '../Entity';
import { GameContext } from '../GameContext';
import { Level } from '../Level';
import { Trait } from '../Trait';
import { Spawner } from './Spawner';
import { Trigger } from './Trigger';

// const listofTraitsWhichCanBeScheduled = [Spawner, Trigger] as const; // const assertion
// type ScheduledTraitsUnionType = (typeof listofTraitsWhichCanBeScheduled)[number]; // Spawner | Trigger;

type ScheduledTraitsType = Spawner | Trigger;

type ScheduleFrequency = number;

export class UpdateScheduler extends Trait {
  constructor() {
    super();
    this.addTraitToBeScheduled(Spawner, 50);
    this.addTraitToBeScheduled(Trigger, 100);
  }

  traitsToBeScheduled = new Map<TraitConstructor<ScheduledTraitsType>, ScheduleFrequency>();

  addTraitToBeScheduled(TraitClass: TraitConstructor<ScheduledTraitsType>, frequency: ScheduleFrequency) {
    this.traitsToBeScheduled.set(TraitClass, frequency);
  }

  updateFrequencyForScheduledTrait(TraitClass: TraitConstructor<ScheduledTraitsType>, newFrequency: ScheduleFrequency) {
    if (!this.traitsToBeScheduled.has(TraitClass)) throw new Error(`There isn't a ${TraitClass} reg`);
    this.traitsToBeScheduled.set(TraitClass, newFrequency);
  }

  stopTraitFromBeingScheduled(TraitClass: TraitConstructor<ScheduledTraitsType>) {
    this.traitsToBeScheduled.delete(TraitClass);
  }

  update(entity: Entity, gameContext: GameContext, level: Level): void {
    this.schedule(gameContext.tick);
  }

  schedule(tick: number) {
    for (let [TraitClass, frequency] of this.traitsToBeScheduled.entries()) {
      // @ts-ignore
      TraitClass.SHOULD_UPDATE = tick % frequency === 0 ? true : false;
    }
  }
}
