export default abstract class Trait {
  NAME: string;
  constructor(name: string) {
    this.NAME = name;
  }

  update(...args: any[]): void {}
}
