import { DialogContent } from '@radix-ui/react-dialog';
import * as Portal from '@radix-ui/react-portal';
import classNames from 'classnames';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import {
  Link,
  LinkProps,
  Route,
  Routes,
  useNavigate,
  useParams,
} from 'react-router-dom';
import create from 'zustand';
import { Avatar } from '../components/Avatar';
import { Dialog } from '../components/Dialog';
import { ErrorAlert } from '../components/ErrorAlert';
import { Help } from './Help';
import { Notifications } from './notifications/Notifications';
import { NotificationsLink } from './notifications/NotificationsLink';
import { Search } from './Search';
import { SystemPreferences } from '../preferences/SystemPreferences';
import { useSystemUpdate } from '../logic/useSystemUpdate';
import useVereState from '../state/vere';
import { Bullet } from '../components/icons/Bullet';
import { Cross } from '../components/icons/Cross';
import GetApps from './GetApps';
import LandscapeWayfinding from '../components/LandscapeWayfinding';
import { useCalm } from '../state/settings';

export interface MatchItem {
  url: string;
  openInNewTab: boolean;
  value: string;
  display?: string;
}

interface AppSearchStore {
  rawInput: string;
  searchInput: string;
  matches: MatchItem[];
  selectedMatch?: MatchItem;
  selection: React.ReactNode;
  select: (selection: React.ReactNode, input?: string) => void;
}

export const useAppSearchStore = create<AppSearchStore>((set) => ({
  rawInput: '',
  searchInput: '',
  matches: [],
  selectedMatch: undefined,
  selection: null,
  select: (selection: React.ReactNode, input?: string) =>
    set({
      rawInput: input || '',
      searchInput: input || '',
      selection,
    }),
}));

window.appSearch = useAppSearchStore.getState;

export type MenuState =
  | 'closed'
  | 'search'
  | 'get-apps'
  | 'app'
  | 'notifications'
  | 'help-and-support'
  | 'system-preferences'
  | 'upgrading';

type PrefsLinkProps = Omit<LinkProps, 'to'> & {
  menuState: string;
  systemBlocked?: string[];
};

export const SystemPrefsLink = ({
  menuState,
  systemBlocked,
}: PrefsLinkProps) => {
  const active = ['system-preferences'].indexOf(menuState) >= 0;

  if (active) {
    return (
      <Link
        to="/"
        className="circle-button h4 default-ring relative z-50 flex-none bg-gray-50"
      >
        <Cross className="h-3 w-3 fill-current" />
        <span className="sr-only">Close</span>
      </Link>
    );
  }

  return (
    <Link to="/system-preferences" className="relative flex-none">
      <Avatar shipName={window.ship} size="nav" />
      {systemBlocked && (
        <Bullet
          className="absolute -top-2 -right-2 ml-auto h-5 w-5 text-orange-500"
          aria-label="System Needs Attention"
        />
      )}
    </Link>
  );
};

export const GetAppsLink = () => {
  return (
    <Link
      to="/get-apps"
      className="flex h-9 w-[125px] items-center justify-center space-x-2 rounded-lg bg-blue-soft px-3 py-2.5"
    >
      <span className="whitespace-nowrap font-semibold text-blue">
        Get Urbit Apps
      </span>
    </Link>
  );
};

export const Nav: FunctionComponent = () => {
  const navigate = useNavigate();
  const { menu } = useParams<{ menu: MenuState }>();
  const navRef = useRef<HTMLDivElement>(null);
  const { disableWayfinding } = useCalm();
  const { systemBlocked } = useSystemUpdate();
  const { isLatest, loaded } = useVereState();
  const [dialogContentOpen, setDialogContentOpen] = useState(false);
  const select = useAppSearchStore((state) => state.select);

  const runtimeOutOfDate = (loaded && !(isLatest));

  const menuState = menu || 'closed';
  const isOpen =
    menuState !== 'upgrading' && menuState !== 'closed' && menuState !== 'app';

  useEffect(() => {
    if (!isOpen) {
      select(null);
      setDialogContentOpen(false);
    }
  }, [isOpen]);

  const onDialogClose = useCallback((open: boolean) => {
    if (!open) {
      navigate('/');
    }
  }, []);

  return (
    <ErrorBoundary FallbackComponent={ErrorAlert} onReset={() => navigate('/')}>
      {/* Using portal so that we can retain the same nav items both in the dialog and in the base header */}
      <Portal.Root
        containerRef={navRef}
        className="flex w-full items-center space-x-2 sm:justify-center"
      >
        <SystemPrefsLink menuState={menuState} systemBlocked={systemBlocked || runtimeOutOfDate} />
        <NotificationsLink
          navOpen={isOpen}
          notificationsOpen={menu === 'notifications'}
        />
        <GetAppsLink />
        {!disableWayfinding && <LandscapeWayfinding className="sm:hidden" />}
      </Portal.Root>

      <div
        ref={navRef}
        className={classNames(
          'mx-auto my-6 w-full max-w-[712px] font-semibold text-gray-400',
          dialogContentOpen && 'h-9'
        )}
        role="combobox"
        aria-controls="leap-items"
        aria-owns="leap-items"
        aria-expanded={isOpen}
      />
      <Dialog open={isOpen} onOpenChange={onDialogClose}>
        <DialogContent
          className="scroll-left-50 scroll-full-width outline-none fixed top-0 z-50 mt-4 flex  h-auto max-w-[882px] -translate-x-1/2 flex-col  justify-start px-4  text-gray-400 sm:bottom-auto sm:mt-12 sm:pb-4"
          role="combobox"
          aria-controls="leap-items"
          aria-owns="leap-items"
          aria-expanded={isOpen}
        >
          <div
            id="leap-items"
            className="default-ring grid grid-rows-[fit-content(calc(100vh-6.25rem))] overflow-hidden rounded-xl bg-white focus-visible:ring-2"
            tabIndex={0}
            role="listbox"
          >
            <Routes>
              <Route path="notifications" element={<Notifications />} />
              <Route
                path="system-preferences/*"
                element={<SystemPreferences />}
              >
                <Route path=":submenu/*" element={<SystemPreferences />} />
              </Route>
              <Route path="help-and-support" element={<Help />} />
              <Route path="get-apps" element={<GetApps />} />
              <Route path="search/*" element={<Search />} />
            </Routes>
          </div>
        </DialogContent>
      </Dialog>
    </ErrorBoundary>
  );
};
