import produce from 'immer';
import create from 'zustand';
import _ from 'lodash';
import React, { useEffect } from 'react';
import { persist } from 'zustand/middleware';
import { MatchItem, useAppSearchStore } from '../Nav';
import { providerMatch } from './Providers';
import { AppList } from '../../components/AppList';
import { ProviderList } from '../../components/ProviderList';
import { AppLink } from '../../components/AppLink';
import { ShipName } from '../../components/ShipName';
import { ProviderLink } from '../../components/ProviderLink';
import {
  ChargesWithDesks,
  useCharges,
  useDefaultAlly,
} from '../../state/docket';
import {
  clearStorageMigration,
  createStorageKey,
  getAppHref,
  storageVersion,
} from '@/logic/utils';
import useContactState, { emptyContact } from '../../state/contact';

export interface RecentsStore {
  recentApps: string[];
  recentDevs: string[];
  addRecentApp: (desk: string) => void;
  addRecentDev: (ship: string) => void;
  removeRecentApp: (desk: string) => void;
}

export const useRecentsStore = create<RecentsStore>(
  persist<RecentsStore>(
    (set) => ({
      recentApps: [],
      recentDevs: [],
      addRecentApp: (desk: string) => {
        set(
          produce((draft: RecentsStore) => {
            const hasApp = draft.recentApps.find(
              (testDesk) => testDesk === desk
            );
            if (!hasApp) {
              draft.recentApps.unshift(desk);
            }

            draft.recentApps = _.take(draft.recentApps, 3);
          })
        );
      },
      addRecentDev: (dev) => {
        set(
          produce((draft: RecentsStore) => {
            const hasDev = draft.recentDevs.includes(dev);
            if (!hasDev) {
              draft.recentDevs.unshift(dev);
            }

            draft.recentDevs = _.take(draft.recentDevs, 3);
          })
        );
      },
      removeRecentApp: (desk: string) => {
        set(
          produce((draft: RecentsStore) => {
            _.remove(draft.recentApps, (test) => test === desk);
          })
        );
      },
    }),
    {
      name: createStorageKey('recents-store'),
      version: storageVersion,
      migrate: clearStorageMigration,
    }
  )
);

window.recents = useRecentsStore.getState;

export function addRecentDev(dev: string) {
  return useRecentsStore.getState().addRecentDev(dev);
}

export function addRecentApp(app: string) {
  return useRecentsStore.getState().addRecentApp(app);
}

function getApps(desks: string[], charges: ChargesWithDesks) {
  return desks.filter((desk) => desk in charges).map((desk) => charges[desk]);
}

export const Home = () => {
  const selectedMatch = useAppSearchStore((state) => state.selectedMatch);
  const { recentApps, recentDevs } = useRecentsStore();
  const charges = useCharges();
  const groups = charges?.landscape;
  const contacts = useContactState((s) => s.contacts);
  const defAlly = useDefaultAlly();
  const defaultAlly = {
    shipName: defAlly,
    ...(contacts[defAlly] || emptyContact),
  };
  const providerList = recentDevs.map((d) => ({
    shipName: d,
    ...(contacts[d] || emptyContact),
  }));
  const apps = getApps(recentApps, charges);

  useEffect(() => {
    const appMatches = apps.map((app) => ({
      url: getAppHref(app.href),
      openInNewTab: true,
      value: app.desk,
      display: app.title,
    }));
    const devs = recentDevs.map(providerMatch);

    useAppSearchStore.setState({
      matches: ([] as MatchItem[]).concat(appMatches, devs),
    });
  }, [recentApps, recentDevs]);

  return (
    <div className="h-full overflow-y-auto p-4 font-semibold leading-tight text-black md:p-8">
      <h2 id="recent-apps" className="h4 mb-4 text-gray-500">
        Recent Apps
      </h2>
      {apps.length === 0 && (
        <div className="rounded-xl bg-gray-50 p-6">
          <p>Apps you use will be listed here, in the order you used them.</p>
          <p className="mt-4">
            You can click/tap/keyboard on a listed app to open it.
          </p>
          {groups && (
            <AppLink
              app={groups}
              size="small"
              className="mt-6"
              onClick={() => addRecentApp('groups')}
            />
          )}
        </div>
      )}
      {apps.length > 0 && (
        <AppList
          apps={apps}
          labelledBy="recent-apps"
          matchAgainst={selectedMatch}
          size="small"
        />
      )}
      <hr className="-mx-4 my-6 border-t-2 border-gray-50 md:-mx-8 md:my-9" />
      <h2 id="recent-devs" className="h4 mb-4 text-gray-500">
        Recent Developers
      </h2>
      {recentDevs.length === 0 && (
        <div className="rounded-xl bg-gray-50 p-6">
          <p className="mb-4">
            Urbit app developers you search for will be listed here.
          </p>
          {defaultAlly && (
            <>
              <p className="mb-6">
                Try out app discovery by visiting{' '}
                <ShipName name={defaultAlly.shipName} /> below.
              </p>
              <ProviderLink
                adjustBG={false}
                provider={defaultAlly}
                size="small"
                onClick={() => addRecentDev(defaultAlly.shipName)}
              />
            </>
          )}
        </div>
      )}
      {recentDevs.length > 0 && (
        <ProviderList
          providers={providerList}
          labelledBy="recent-devs"
          matchAgainst={selectedMatch}
          size="small"
        />
      )}
    </div>
  );
};
