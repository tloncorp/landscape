/* eslint-disable no-param-reassign */
import { DelBucket, DelEntry, PutBucket, Value } from '@urbit/api';
import _ from 'lodash';
import api from '../api';
import useReactQuerySubscription from '@/logic/useReactQuerySubscription';
import { useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import produce from 'immer';

interface PutEntry {
  // this is defined here because the PutEntry type in @urbit/api is missing the desk field
  'put-entry': {
    'bucket-key': string;
    'entry-key': string;
    value: Value;
    desk: string;
  };
}

interface SettingsEvent {
  'settings-event': PutEntry | PutBucket | DelEntry | DelBucket;
}

interface BrowserSetting {
  browserId: string;
  browserNotifications: boolean;
  protocolHandling: boolean;
}

export interface SettingsState {
  calmEngine: {
    disableAppTileUnreads: boolean;
    disableAvatars: boolean;
    disableNicknames: boolean;
    disableSpellcheck: boolean;
    disableRemoteContent: boolean;
    disableWayfinding: boolean;
  };
  display: {
    theme: 'light' | 'dark' | 'auto';
    doNotDisturb: boolean;
  };
  tiles: {
    order: string[];
  };
  loaded: boolean;
  browserSettings: {
    settings: Stringified<BrowserSetting[]>;
  };
}

export const useSettings = () => {
  const { data, ...rest } = useReactQuerySubscription<
    { desk: SettingsState },
    SettingsEvent
  >({
    scry: `/desk/${window.desk}`,
    scryApp: 'settings',
    app: 'settings',
    path: `/desk/${window.desk}`,
    queryKey: ['settings', window.desk],
  });

  return useMemo(() => {
    if (!data) {
      return { data: undefined, ...rest };
    }

    const { desk } = data;

    return { data: desk, ...rest };
  }, [rest, data]);
};


export function useDisplay(): SettingsState['display'] {
  const { data, isLoading } = useSettings();

  return useMemo(() => {
    if (isLoading || data === undefined || data.display === undefined) {
      return {
        theme: 'auto',
        doNotDisturb: false,
      };
    }

    return data.display;
  }, [isLoading, data]);
}

const emptyOrder: string[] = [];
export function useTiles(): SettingsState['tiles'] & { loaded: boolean } {
  const { data, isSuccess, isError } = useSettings();

  return {
    order: data?.tiles?.order || emptyOrder,
    loaded: isSuccess || isError,
  };
}

const emptyCalm: SettingsState['calmEngine'] = {
  disableAppTileUnreads: false,
  disableAvatars: false,
  disableRemoteContent: false,
  disableSpellcheck: false,
  disableNicknames: false,
  disableWayfinding: false,
};

const loadingCalm: SettingsState['calmEngine'] = {
  disableAppTileUnreads: true,
  disableAvatars: true,
  disableRemoteContent: true,
  disableSpellcheck: true,
  disableNicknames: true,
  disableWayfinding: true,
};

export function useCalm() {
  const { data, isLoading } = useSettings();

  return useMemo(() => {
    if (isLoading) {
      return loadingCalm;
    }

    if (!data || !data.calmEngine) {
      return emptyCalm;
    }

    const { calmEngine } = data;

    return calmEngine as SettingsState['calmEngine'];
  }, [isLoading, data]);
}

export function usePutEntryMutation({
  bucket,
  key,
}: {
  bucket: string;
  key: string;
}) {
  const queryClient = useQueryClient();
  const mutationFn = async (variables: { val: Value }) => {
    const { val } = variables;
    await api.trackedPoke<PutEntry, SettingsEvent>(
      {
        app: 'settings',
        mark: 'settings-event',
        json: {
          'put-entry': {
            desk: window.desk,
            'bucket-key': bucket,
            'entry-key': key,
            value: val,
          },
        },
      },
      {
        app: 'settings',
        path: `/desk/${window.desk}`,
      },
      (event) => {
        // default validator was not working
        const { 'settings-event': data } = event;

        if (data && 'put-entry' in data) {
          const { 'put-entry': entry } = data;
          if (entry) {
            const { 'bucket-key': bk, 'entry-key': ek, value: v } = entry;

            if (bk === bucket && ek === key) {
              return v === val;
            }

            return false;
          }
          return false;
        }
        return false;
      }
    );
  };

  return useMutation(['put-entry', bucket, key], mutationFn, {
    onMutate: ({ val }) => {
      const previousSettings = queryClient.getQueryData<{
        desk: SettingsState;
      }>(['settings', window.desk]);
      queryClient.setQueryData<{ desk: SettingsState }>(
        ['settings', window.desk],
        produce((draft) => {
          if (!draft) {
            return { desk: { [bucket]: { [key]: val } } };
          }

          if (!(draft.desk as any)[bucket]) {
            (draft.desk as any)[bucket] = { [key]: val };
          } else {
            (draft.desk as any)[bucket][key] = val;
          }
        })
      );

      return { previousSettings };
    },
    onError: (err, variables, rollback) => {
      queryClient.setQueryData<{ desk: SettingsState }>(
        ['settings', window.desk],
        rollback?.previousSettings
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries(['settings', window.desk]);
    },
  });
}

export function useCalmSettingMutation(key: keyof SettingsState['calmEngine']) {
  const { mutate, status } = usePutEntryMutation({
    bucket: 'calmEngine',
    key,
  });

  return {
    mutate: (val: boolean) => mutate({ val }),
    status,
  };
}

export function parseBrowserSettings(
  settings: Stringified<BrowserSetting[]>
): BrowserSetting[] {
  return settings !== '' ? JSON.parse<BrowserSetting[]>(settings) : [];
}

export function getBrowserSetting(
  settings: BrowserSetting[],
  browserId: string
): BrowserSetting | undefined {
  return settings.find((el) => el.browserId === browserId);
}

export function setBrowserSetting(
  settings: BrowserSetting[],
  newSetting: Partial<BrowserSetting>,
  browserId: string
): BrowserSetting[] {
  const oldSettings = settings.slice(0);
  const oldSettingIndex = oldSettings.findIndex(
    (s) => s.browserId === browserId
  );
  const setting = {
    ...oldSettings[oldSettingIndex],
    browserId,
    ...newSetting,
  };

  if (oldSettingIndex >= 0) {
    oldSettings.splice(oldSettingIndex, 1);
  }

  return [...oldSettings, setting];
}

const emptyBrowserSettings: BrowserSetting[] = [];
export function useBrowserSettings() {
  const { data, isLoading } = useSettings();

  return useMemo(() => {
    if (isLoading) {
      return emptyBrowserSettings;
    }

    if (!data || !data.browserSettings || !data.browserSettings.settings) {
      return emptyBrowserSettings;
    }

    return parseBrowserSettings(data.browserSettings.settings);
  }, [isLoading, data]);
}

export function useProtocolHandling(browserId: string): boolean {
  const settings = useBrowserSettings();
  const browserSetting = getBrowserSetting(settings, browserId);
  return browserSetting?.protocolHandling ?? false;
}

export function useBrowserNotifications(browserId: string): boolean {
  const settings = useBrowserSettings();
  const browserSetting = getBrowserSetting(settings, browserId);
  return browserSetting?.browserNotifications ?? false;
}
