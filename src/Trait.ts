export default abstract class Trait {
  NAME: string;
  constructor(name: string) {
    this.NAME = name;
  }

  obstruct(...args: any[]): void {}

  update(...args: any[]): void {}
}
