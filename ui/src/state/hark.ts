import { unstable_batchedUpdates as batchUpdates } from 'react-dom';
import produce from 'immer';
import create from 'zustand';
import { Blanket, Carpet, HarkAction, Rope, Seam } from './hark-types';
import api from './api';
import { decToUd } from '@urbit/api';

export interface HarkState {
  set: (fn: (sta: HarkState) => void) => void;
  batchSet: (fn: (sta: HarkState) => void) => void;
  /** carpet: represents unread notifications at the system level */
  carpet: Carpet;
  /** blanket: represents read notifications at the system level */
  blanket: Blanket;
  /** start: fetches system-wide notifications and subscribes to updates */
  start: () => void;
  /** retrieve: refreshes system-wide notifications to latest  */
  retrieve: () => void;
  sawRope: (rope: Rope) => void;
  sawSeam: (seam: Seam) => void;
}

export function emptyCarpet(seam: Seam) {
  return {
    seam,
    yarns: {},
    cable: [],
    stitch: 0,
  };
}

export function emptyBlanket(seam: Seam) {
  return {
    seam,
    yarns: {},
    quilt: {},
  };
}

function harkAction(action: HarkAction) {
  return {
    app: 'hark',
    mark: 'hark-action',
    json: action,
  };
}

const useHarkState = create<HarkState>((set, get) => ({
  set: (fn) => {
    set(produce(get(), fn));
  },
  batchSet: (fn) => {
    batchUpdates(() => {
      get().set(fn);
    });
  },
  carpet: emptyCarpet({ all: null }),
  blanket: emptyBlanket({ all: null }),
  start: () => {
    get().retrieve();

    api.subscribe({
      app: 'hark',
      path: '/ui',
      event: (event: HarkAction) => {
        console.log(event, get().carpet);
        const { retrieve } = get();
        retrieve();
      },
    });
  },
  retrieve: async () => {
    const carpet = await api.scry<Carpet>({
      app: 'hark',
      path: `/all/latest`,
    });

    const blanket = await api.scry<Blanket>({
      app: 'hark',
      path: `/all/quilt/${decToUd(carpet.stitch.toString())}`,
    });

    get().batchSet((draft) => {
      draft.carpet = carpet;
      draft.blanket = blanket;
    });
  },
  sawRope: (rope) => {
    api.poke(
      harkAction({
        'saw-rope': rope,
      })
    );
  },
  sawSeam: (seam) => {
    api.poke(
      harkAction({
        'saw-seam': seam,
      })
    );
  },
}));

export default useHarkState;
