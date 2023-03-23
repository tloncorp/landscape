import React, { useEffect } from 'react';
import Mousetrap from 'mousetrap';
import {
  BrowserRouter,
  Switch,
  Route,
  useHistory,
  useLocation,
  RouteComponentProps,
  Redirect,
} from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { Grid } from './pages/Grid';
import useDocketState from './state/docket';
import { PermalinkRoutes } from './pages/PermalinkRoutes';
import useKilnState from './state/kiln';
import useContactState from './state/contact';
import api from './state/api';
import { useMedia } from './logic/useMedia';
import { useCalm, useSettingsState, useTheme } from './state/settings';
import { useBrowserId, useLocalState } from './state/local';
import { ErrorAlert } from './components/ErrorAlert';
import { useErrorHandler } from './logic/useErrorHandler';
import useHarkState from './state/hark';
import { useNotifications } from './nav/notifications/useNotifications';
import { makeBrowserNotification } from './logic/utils';

const getNoteRedirect = (path: string) => {
  if (path.startsWith('/desk/')) {
    const [, , desk] = path.split('/');
    return `/apps/${desk}`;
  }

  if (path.startsWith('/grid/')) {
    // Handle links to grid features (preferences, etc)
    const route = path
      .split('/')
      .filter((el) => el !== 'grid')
      .join('/');
    return route;
  }
  return '';
};

const getId = async () => {
  const fpPromise = FingerprintJS.load();
  const fp = await fpPromise;
  const result = await fp.get();
  return result.visitorId;
};

function OldLeapRedirect({ location }: RouteComponentProps) {
  const path = location.pathname.replace('/leap', '');
  return <Redirect to={path} />;
}

const AppRoutes = () => {
  const { push } = useHistory();
  const { search } = useLocation();
  const handleError = useErrorHandler();
  const browserId = useBrowserId();
  const {
    display: { doNotDisturb },
  } = useSettingsState.getState();
  const { count, unreadNotifications } = useNotifications();

  useEffect(() => {
    if (!('Notification' in window) || doNotDisturb) {
      return;
    }

    try {
      if (count > 0 && Notification.permission === 'granted') {
        unreadNotifications.forEach((bin) => {
          makeBrowserNotification(bin);
        });
      }
      if (count > 0 && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    } catch (error) {
      console.error(error);
    }
  }, [count, unreadNotifications]);

  useEffect(() => {
    getId().then((value) => {
      useLocalState.setState({ browserId: value });
    });
  }, [browserId]);

  useEffect(() => {
    const query = new URLSearchParams(search);
    if (query.has('grid-note')) {
      const redir = getNoteRedirect(query.get('grid-note')!);
      push(redir);
    }
  }, [search]);

  const theme = useTheme();
  const isDarkMode = useMedia('(prefers-color-scheme: dark)');

  useEffect(() => {
    if ((isDarkMode && theme === 'auto') || theme === 'dark') {
      document.body.classList.add('dark');
      useLocalState.setState({ currentTheme: 'dark' });
    } else {
      document.body.classList.remove('dark');
      useLocalState.setState({ currentTheme: 'light' });
    }
  }, [isDarkMode, theme]);

  useEffect(
    handleError(() => {
      window.name = 'grid';

      const { initialize: settingsInitialize, fetchAll } =
        useSettingsState.getState();
      settingsInitialize(api);
      fetchAll();

      const { fetchDefaultAlly, fetchAllies, fetchCharges } =
        useDocketState.getState();
      fetchDefaultAlly();
      fetchCharges();
      fetchAllies();

      const { initializeKiln } = useKilnState.getState();
      initializeKiln();

      useContactState.getState().initialize(api);
      useHarkState.getState().start();

      Mousetrap.bind(['command+/', 'ctrl+/'], () => {
        push('/search');
      });
    }),
    []
  );

  return (
    <Switch>
      <Route path="/perma" component={PermalinkRoutes} />
      <Route path="/leap/*" component={OldLeapRedirect} />
      <Route path={['/:menu', '/']} component={Grid} />
    </Switch>
  );
};

export function App() {
  const base = import.meta.env.MODE === 'mock' ? undefined : '/apps/grid';

  return (
    <ErrorBoundary
      FallbackComponent={ErrorAlert}
      onReset={() => window.location.reload()}
    >
      <BrowserRouter basename={base}>
        <AppRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
