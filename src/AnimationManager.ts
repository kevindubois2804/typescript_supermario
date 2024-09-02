import { AnimationResolver } from './AnimationResolver';
import { Entity } from './Entity';
import { Utils } from './utilities/Utils';

export type AnimRouteCallBack = (...args: any[]) => void | string;

export class AnimationManager {
  resolvers = new Map<string, AnimationResolver>();
  animRoutes = new Map<String, AnimRouteCallBack>();
  defaultAnimName: string;

  addResolver(name: string, resolver: AnimationResolver) {
    this.resolvers.set(name, resolver);
  }

  removeResolver(name: string) {
    this.resolvers.delete(name);
  }

  addRoute(name: string, callback: AnimRouteCallBack) {
    this.animRoutes.set(name, callback);
  }

  removeRoute(name: string) {
    this.animRoutes.delete(name);
  }

  routeFrame(entity: Entity): string {
    for (let callback of this.animRoutes.values()) {
      const returnValueOfCallBack = callback(entity);
      if (Utils.isString(returnValueOfCallBack)) return returnValueOfCallBack;
    }

    return this.defaultAnimName ? this.defaultAnimName : 'idle';
  }

  setDefaultAnimName(name: string) {
    this.defaultAnimName = name;
  }
}
