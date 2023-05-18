import useReactQueryScry from '@/logic/useReactQueryScry';

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

export function useGroups() {
  const { data, ...rest } = useReactQueryScry<Groups>({
    queryKey: ['groups'],
    app: 'groups',
    path: `/groups/light`,
  });

  if (rest.isLoading || rest.isError) {
    return {} as Groups;
  }

  return data;
}
