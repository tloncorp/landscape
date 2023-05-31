import api from '@/api';
import create, { SetState } from 'zustand';
import produce from 'immer';

interface Vere {
  cur: VereState;
  next?: VereState;
  set: SetState<Vere>;
  loaded: boolean;
  isLatest: boolean;
  vereVersion: string;
  latestVereVersion: string;
}

interface VereState {
  rev: string;
  non?: string;
  zuse?: number;
  arvo?: number;
  lull?: number;
  hoon?: number;
  nock?: number;
}

const useVereState = create<Vere>((set, get) => ({
  loaded: false,
  set
}))

const fetchRuntimeVersion = () => {
  api.thread({
    inputMark: 'noun',
    outputMark: 'vere-update',
    desk: 'base',
    threadName: 'runtime-version',
    body: '',
  }).then((data: Vere) => {
    useVereState.setState((state) => {
      const vereVersion = data.cur.rev.split('/vere/~.')[1];
      const isLatest = data.next === undefined;
      const latestVereVersion = !isLatest ? data.next.rev.split('/vere/~.')[1] : vereVersion
        return Object.assign(data, {loaded: true, isLatest, vereVersion, latestVereVersion});
    })
  });
}

fetchRuntimeVersion()

setInterval(fetchRuntimeVersion, 1800000)

export default useVereState;;

// window.vere = useVereState.getState;
