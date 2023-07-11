import { QueryKey, useQuery, UseQueryOptions } from '@tanstack/react-query';
import api from '@/api';
import useSchedulerStore from '@/state/scheduler';

export default function useReactQueryScry<Data>({
  queryKey,
  app,
  path,
  priority = 3,
  options,
}: {
  queryKey: QueryKey;
  app: string;
  path: string;
  priority?: number;
  options?: UseQueryOptions<Data>;
}) {
  const fetchData = async () =>
    useSchedulerStore.getState().wait(
      async () =>
        api.scry<Data>({
          app,
          path,
        }),
      priority
    );

  return useQuery<Data>(queryKey, fetchData, {
    retryOnMount: false,
    ...options,
  });
}
