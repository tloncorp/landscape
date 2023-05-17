import _ from 'lodash';
import {
  QueryKey,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import api from '@/api';
import useSchedulerStore from '@/state/scheduler';

export default function useReactQuerySubscription<Data, Event>({
  queryKey,
  app,
  path,
  scry,
  scryApp = app,
  priority = 3,
  onEvent,
  options,
}: {
  queryKey: QueryKey;
  app: string;
  path: string;
  scry: string;
  scryApp?: string;
  priority?: number;
  onEvent?: (event: Event) => void;
  options?: UseQueryOptions<Data>;
}) {
  const queryClient = useQueryClient();
  const invalidate = useRef(
    _.debounce(
      () => {
        queryClient.invalidateQueries(queryKey);
      },
      300,
      { leading: true, trailing: true }
    )
  );

  const fetchData = async () =>
    useSchedulerStore.getState().wait(
      async () =>
        api.scry<Data>({
          app: scryApp,
          path: scry,
        }),
      priority
    );

  useEffect(() => {
    api.subscribe({
      app,
      path,
      event: (event) => {
        onEvent && onEvent(event);
        invalidate.current();
      },
    });
  }, [app, path, queryClient, queryKey]);

  return useQuery<Data>(queryKey, fetchData, options);
}
