import { Entity } from './Entity';
import { Trait } from './Trait';
import { InputNotifier } from './traits/InputNotifier';

type Receiver = Entity;

export class InputRouter {
  inputNotifierTrait: Trait = new InputNotifier();

  receivers = new Set<Receiver>();

  addReceiver(receiver: Receiver) {
    receiver.addTrait(this.inputNotifierTrait);
    this.receivers.add(receiver);
  }

  dropReceiver(receiver: Receiver) {
    receiver.removeTrait(InputNotifier);
    this.receivers.delete(receiver);
  }

  route(routeInput: (receiver: Receiver) => void) {
    for (const receiver of this.receivers) {
      routeInput(receiver);
    }
  }
}
