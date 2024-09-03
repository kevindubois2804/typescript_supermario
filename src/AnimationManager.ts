import { AnimationResolver } from './AnimationResolver';
import { Entity } from './Entity';
import { Utils } from './utilities/Utils';

export type AnimationManagerRouteCallback = (...args: any[]) => void | string | boolean;

export class AnimationManager {
  resolvers = new Map<string, AnimationResolver>();
  animRoutes = new Map<String, AnimationManagerRouteCallback>();
  headingRoutes = new Map<String, AnimationManagerRouteCallback>();
  defaultAnimName: string;
  defaultHeading = false;

  addResolver(name: string, resolver: AnimationResolver) {
    this.resolvers.set(name, resolver);
  }

  removeResolver(name: string) {
    this.resolvers.delete(name);
  }

  addAnimationRoute(name: string, callback: AnimationManagerRouteCallback) {
    this.animRoutes.set(name, callback);
  }

  addHeadingRoute(name: string, callback: AnimationManagerRouteCallback) {
    this.headingRoutes.set(name, callback);
  }

  removeAnimationRoute(name: string) {
    this.animRoutes.delete(name);
  }

  removeHeadingRoute(name: string) {
    this.headingRoutes.delete(name);
  }

  routeFrame(entity: Entity): string {
    for (let callback of this.animRoutes.values()) {
      const returnValueOfCallBack = callback(entity);
      if (Utils.isString(returnValueOfCallBack)) return returnValueOfCallBack;
    }

    return this.defaultAnimName ? this.defaultAnimName : 'idle';
  }

  routeHeading(entity: Entity): boolean {
    for (let callback of this.headingRoutes.values()) {
      const returnValueOfCallBack = callback(entity);
      if (Utils.isBoolean(returnValueOfCallBack)) return returnValueOfCallBack;
    }

    return this.defaultHeading;
  }

  setDefaultAnimName(name: string) {
    this.defaultAnimName = name;
  }

  setDefaultAnimHeading(bool: boolean) {
    this.defaultHeading = bool;
  }
}
