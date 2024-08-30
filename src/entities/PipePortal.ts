import { AudioBoard } from '../AudioBoard';
import { Entity } from '../Entity';
import { loadAudioBoard } from '../loaders/audio';
import { Direction } from '../math';
import Pipe from '../traits/Pipe';
import { EntityProps } from '../types';

export function loadPipePortal(audioContext: AudioContext) {
  return Promise.all([loadAudioBoard('pipe-portal', audioContext)]).then(([audio]) => {
    return createPipePortalFactory(audio);
  });
}

function createPipePortalFactory(audio: AudioBoard) {
  return function createPipePortal(props: EntityProps) {
    const pipe = new Pipe();
    pipe.direction.copy(Direction[props.dir]);
    const entity = new Entity();
    entity.audio = audio;
    entity.props = props;
    entity.size.set(24, 30);
    entity.addTrait(pipe);
    return entity;
  };
}
