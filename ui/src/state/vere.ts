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

function parseVersion(versionPath: string | undefined) {
  if (versionPath === undefined) {
    return null;
  }

  const pattern = /~\.(\d+\.\d+)/gi;
  const match = pattern.exec(versionPath);
  if (!match) {
    return null;
  }

  return match[1];
}

const useVereState = create<Vere>((set, get) => ({
  cur: {
    rev: '',
  },
  loaded: false,
  isLatest: true,
  vereVersion: '',
  latestVereVersion: '',
  set,
}));

const fetchRuntimeVersion = () => {
  api
    .thread({
      inputMark: 'noun',
      outputMark: 'vere-update',
      desk: 'base',
      threadName: 'runtime-version',
      body: '',
    })
    .then((data) => {
      useVereState.setState((state) => {
        if (typeof data === 'object' && data !== null) {
          const vereData = data as Vere;
          const vereVersion = parseVersion(vereData.cur.rev);
          const latestVereVersion =
            vereData.next !== undefined
              ? parseVersion(vereData.next.rev)
              : vereVersion;
          const isLatest =
            vereVersion === latestVereVersion || vereData.next === undefined;

          return Object.assign(vereData, {
            loaded: true,
            isLatest,
            vereVersion,
            latestVereVersion,
          });
        }
        return state;
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

fetchRuntimeVersion();

setInterval(fetchRuntimeVersion, 1800000);

export default useVereState;

// window.vere = useVereState.getState;
