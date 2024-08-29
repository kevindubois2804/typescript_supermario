import { Entity } from '../Entity';

export const Align = {
  center(target: Entity, subject: Entity) {
    subject.bounds.setCenter(target.bounds.getCenter());
  },

  bottom(target: Entity, subject: Entity) {
    subject.bounds.bottom = target.bounds.bottom;
  },

  top(target: Entity, subject: Entity) {
    subject.bounds.top = target.bounds.top;
  },

  left(target: Entity, subject: Entity) {
    subject.bounds.left = target.bounds.left;
  },

  right(target: Entity, subject: Entity) {
    subject.bounds.right = target.bounds.right;
  },
};
