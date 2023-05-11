import create from 'zustand';
import api from '../../api';

export interface GroupMeta {
  title: string;
  description: string;
  image: string;
  color: string;
}

export interface Group {
  meta: GroupMeta;
  channels?: any;
}

export interface Groups {
  [flag: string]: Group;
}

interface GroupStore {
  groups: Groups;
  retrieve: () => Promise<void>;
}

export const groupStore = create<GroupStore>((set) => ({
  groups: {},
  retrieve: async () => {
    const groups = await api.scry<Groups>({
      app: 'groups',
      path: '/groups',
    });

    set({ groups });
  },
}));
