import React, { useEffect } from 'react';
import Mousetrap from 'mousetrap';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  BrowserRouter,
  Switch,
  Route,
  useHistory,
  useLocation,
  RouteComponentProps,
  Redirect,
} from 'react-router-dom';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { ErrorBoundary } from 'react-error-boundary';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { Grid } from './pages/Grid';
import { PermalinkRoutes } from './pages/PermalinkRoutes';
import useKilnState from './state/kiln';
import useContactState from './state/contact';
import { useMedia } from './logic/useMedia';
import { useDisplay } from './state/settings';
import { useBrowserId, useLocalState } from './state/local';
import { ErrorAlert } from './components/ErrorAlert';
import { useErrorHandler } from './logic/useErrorHandler';
import useSchedulerStore, { useScheduler } from './state/scheduler';
import bootstrap from './state/bootstrap';

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

  const { theme } = useDisplay();
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

      bootstrap();

      const { initializeKiln } = useKilnState.getState();
      initializeKiln();

      useSchedulerStore
        .getState()
        .wait(() => useContactState.getState().start(), 5);

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

function Scheduler() {
  useScheduler();
  return null;
}

export function App() {
  const base = import.meta.env.MODE === 'mock' ? undefined : '/apps/grid';

  return (
    <ErrorBoundary
      FallbackComponent={ErrorAlert}
      onReset={() => window.location.reload()}
    >
      <BrowserRouter basename={base}>
        <ReactQueryDevtools initialIsOpen={false} />
        <TooltipProvider>
          <AppRoutes />
          <Scheduler />
        </TooltipProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
