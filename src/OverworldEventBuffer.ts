type OverworldEventSpec = { tick: number; args: any[] };

export class OverWorldEventBuffer {
  private events = new Map<string | symbol, OverworldEventSpec>();

  emit(name: string | symbol, ...args: any[]) {
    const tick = 0;
    this.events.set(name, { tick, args });
  }

  process(name: string | symbol, callback: (...args: any[]) => void) {
    for (const [eventName, event] of this.events.entries()) {
      console.log(eventName);
      if (eventName === name) {
        console.log(eventName);
        if (event.tick === 1) callback(...event.args);
      }
    }
  }

  clear() {
    for (const [eventName, event] of this.events.entries()) {
      if (event.tick === 1) {
        this.events.delete(eventName);
      } else {
        event.tick++;
      }
    }
  }
}
