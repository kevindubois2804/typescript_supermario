import { Entity } from './Entity';
import { Trait } from './Trait';
import { InputController } from './traits/InputController';

type Receiver = Entity;

export class InputRouter {
  InputControllerTrait: Trait = new InputController();

  receivers = new Set<Receiver>();

  addReceiver(receiver: Receiver) {
    receiver.addTrait(this.InputControllerTrait);
    this.receivers.add(receiver);
  }

  dropReceiver(receiver: Receiver) {
    receiver.removeTrait(InputController);
    this.receivers.delete(receiver);
  }

  route(routeInput: (receiver: Receiver) => void) {
    for (const receiver of this.receivers) {
      routeInput(receiver);
    }
  }
}
