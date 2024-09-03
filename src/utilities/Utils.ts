export class Utils {
  static isString(variable: any) {
    return typeof variable === 'string';
  }
  static isBoolean(variable: any) {
    return typeof variable === 'boolean';
  }
  static generateId() {
    return Math.floor(Math.random() * Date.now());
  }
}
