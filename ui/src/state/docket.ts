import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Allies,
  Charge,
  ChargeUpdateInitial,
  Treaty,
  Docket,
  Treaties,
  AllyUpdateIni,
  AllyUpdateNew,
  TreatyUpdateIni,
  TreatyUpdate,
  docketInstall,
  ChargeUpdate,
  kilnRevive,
  kilnSuspend,
  allyShip,
} from '@urbit/api';
import api from '@/api';
import { normalizeUrbitColor } from '@/logic/utils';
import { Status } from '@/logic/useAsyncCall';
import useReactQuerySubscription from '@/logic/useReactQuerySubscription';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useReactQueryScry from '@/logic/useReactQueryScry';
import { useAddYarnMutation } from './hark';
import { useWatcherStore } from './watcher';

const NOTIFICATION_TIMEOUT = 60 * 1000; // if an action hasn't completed in 60 seconds, show a notification when it does.

export interface ChargeWithDesk extends Charge {
  desk: string;
}

export interface ChargesWithDesks {
  [ref: string]: ChargeWithDesk;
}

export interface DocketWithDesk extends Docket {
  desk: string;
}

export function normalizeDocket<T extends Docket>(docket: T, desk: string): T {
  return {
    ...docket,
    desk,
    color: normalizeUrbitColor(docket.color),
  };
}

export function normalizeDockets<T extends Docket>(
  dockets: Record<string, T>
): Record<string, T> {
  return Object.entries(dockets).reduce(
    (obj: Record<string, T>, [key, value]) => {
      const [, desk] = key.split('/');
      // eslint-disable-next-line no-param-reassign
      obj[key] = normalizeDocket(value, desk);
      return obj;
    },
    {}
  );
}

export function useCharges(): ChargesWithDesks {
  const { mutate } = useAddYarnMutation();
  const { data, ...rest } = useReactQuerySubscription<
    ChargeUpdateInitial,
    ChargeUpdate
  >({
    queryKey: ['docket', 'charges'],
    app: 'docket',
    path: '/charges',
    scry: '/charges',
    onEvent: (data) => {
      if ('add-charge' in data) {
        const { charge, desk } = data['add-charge'];
        const watcher = useWatcherStore.getState().watchers[`install-${desk}`];

        if ('suspend' in charge.chad) {
          return;
        }
        if (watcher && Date.now() - watcher.time > NOTIFICATION_TIMEOUT) {
          mutate({
            yarn: {
              con: [
                'App ',
                { emph: data['add-charge'].desk },
                ' has been installed',
              ],
              wer: `/grid/app/${desk}`,
              but: null,
            },
          });
          useWatcherStore.getState().removeWatcher(`install-${desk}`);
        }
      }
    },
  });

  const charges = useMemo(() => {
    if (!data) {
      return {};
    }
    const normalized = Object.entries(data.initial).reduce(
      (obj: ChargesWithDesks, [key, value]) => {
        // eslint-disable-next-line no-param-reassign
        obj[key] = normalizeDocket(value as ChargeWithDesk, key);
        return obj;
      },
      {}
    );
    return normalized;
  }, [data]);

  return charges;
}

export function useCharge(desk: string) {
  const charges = useCharges();

  return charges[desk];
}

export function useDefaultAlly(): string {
  const { data, ...rest } = useReactQueryScry<string>({
    queryKey: ['treaty', 'default-ally'],
    app: 'treaty',
    path: '/default-ally',
  });

  return data || '';
}

export function useAllies(): Allies {
  const { data, ...rest } = useReactQuerySubscription<
    AllyUpdateIni,
    AllyUpdateNew
  >({
    queryKey: ['treaty', 'allies'],
    app: 'treaty',
    path: '/allies',
    scry: '/allies',
  });

  const allies = useMemo(() => {
    if (!data) {
      return {};
    }
    return data.ini;
  }, [data]);

  return allies;
}

export async function addAlly(ship: string) {
  return api.poke(allyShip(ship));
}

export function useTreaties(): Treaties {
  const { data, ...rest } = useReactQuerySubscription<
    TreatyUpdateIni,
    TreatyUpdate
  >({
    queryKey: ['treaty', 'treaties'],
    app: 'treaty',
    path: '/treaties',
    scry: '/treaties',
  });

  const treaties = useMemo(() => {
    if (!data || !data.ini) {
      return {};
    }

    const normalized = normalizeDockets(data.ini);
    return normalized;
  }, [data]);

  return treaties;
}

export function useAllyTreaties(ship: string) {
  const queryClient = useQueryClient();
  const allies = useAllies();
  const isAllied = ship in allies;
  const [status, setStatus] = useState<Status>('initial');

  useEffect(() => {
    if (Object.keys(allies).length > 0 && !isAllied) {
      setStatus('loading');
      addAlly(ship);
    }
  }, [allies, isAllied, ship]);

  const { data, ...rest } = useReactQueryScry<TreatyUpdateIni>({
    queryKey: ['treaty', 'treaties', ship],
    app: 'treaty',
    path: `/treaties/${ship}`,
    options: {
      enabled: isAllied,
    },
  });

  const treaties = useMemo(() => {
    if (!data) {
      return {};
    }
    return normalizeDockets(data.ini);
  }, [data]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setStatus('error');
    }, 30 * 1000); // wait 30 secs before timing out

    if (Object.keys(treaties).length > 0) {
      setStatus('success');
      clearTimeout(timeout);
      queryClient.setQueryData(
        ['treaty', 'treaties'],
        (old: Treaties | undefined) => {
          if (old === undefined && treaties !== undefined) {
            return treaties;
          }

          if (treaties === undefined) {
            return old;
          }

          return { ...old, ...treaties };
        }
      );
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [treaties]);

  return {
    isAllied,
    treaties,
    status,
  };
}

export function useTreaty(host: string, desk: string) {
  const queryClient = useQueryClient();
  const treaties = useTreaties();
  const ref = `${host}/${desk}`;
  const treaty = treaties[ref];
  const getTreaty = useCallback(
    async (host: string, desk: string) => {
      const result = await api.subscribeOnce<Treaty>(
        'treaty',
        `/treaty/${ref}`,
        20000
      );

      if (result) {
        const newTreaty: Treaty = {
          ...normalizeDocket(result, desk),
          ship: host,
        };
        queryClient.setQueryData(
          ['treaty', 'treaties'],
          (old: Treaties | undefined) => {
            if (old === undefined && result !== undefined) {
              return { [ref]: newTreaty };
            }

            if (result === undefined) {
              return old;
            }

            return { ...old, [ref]: newTreaty };
          }
        );
        return newTreaty;
      }
      return undefined;
    },
    [queryClient, ref]
  );

  if (!treaty) {
    getTreaty(host, desk);
  }

  return treaty;
}

export function useInstallDocketMutation() {
  const mutationFn = async (variables: { ship: string; desk: string }) => {
    useWatcherStore
      .getState()
      .addWatcher(`install-${variables.desk}`, { time: Date.now() });
    return api.poke(docketInstall(variables.ship, variables.desk));
  };

  return useMutation(mutationFn, {
    onSuccess: (data, variables) => {},
  });
}

export function useUninstallDocketMutation() {
  const queryClient = useQueryClient();
  const treaties = useTreaties();
  const charges = useCharges();
  const mutationFn = async (variables: { desk: string }) => {
    return api.trackedPoke(
      {
        app: 'docket',
        mark: 'docket-uninstall',
        json: variables.desk,
      },
      {
        app: 'docket',
        path: '/charges',
      }
    );
  };

  return useMutation(mutationFn, {
    onMutate: (variables) => {
      const charge = charges[variables.desk];
      if (charge) {
        queryClient.setQueryData(
          ['docket', 'charges'],
          (old: ChargesWithDesks | undefined) => {
            if (old === undefined) {
              return old;
            }

            let newCharges = { ...old };

            delete newCharges[variables.desk];

            return newCharges;
          }
        );
      }
    },
  });
}

export function useToggleDocketMutation() {
  const queryClient = useQueryClient();
  const charges = useCharges();
  const mutationFn = async (variables: { desk: string }) => {
    const charge = charges[variables.desk];

    if (!charge) {
      return;
    }

    const suspended = 'suspend' in charge.chad;
    if (suspended) {
      await api.poke(kilnRevive(variables.desk));
    } else {
      await api.poke(kilnSuspend(variables.desk));
    }
  };

  return useMutation(mutationFn, {
    onSuccess: (data, variables) => {
      const charge = charges[variables.desk];
      if (charge) {
        queryClient.setQueryData(
          ['charge', 'charges'],
          (old: ChargesWithDesks | undefined) => {
            if (old === undefined) {
              return { [variables.desk]: charge };
            }

            return { ...old, [variables.desk]: charge };
          }
        );
      }
    },
  });
}

export const landscapeTreatyHost = import.meta.env.LANDSCAPE_HOST as string;
