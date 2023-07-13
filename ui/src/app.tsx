import React, { useEffect } from 'react';
import Mousetrap from 'mousetrap';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  BrowserRouter,
  Route,
  useLocation,
  Routes,
  useNavigate,
  Navigate,
} from 'react-router-dom';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { ErrorBoundary } from 'react-error-boundary';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { Grid } from './pages/Grid';
import useDocketState from './state/docket';
import { PermalinkRoutes } from './pages/PermalinkRoutes';
import useKilnState from './state/kiln';
import useContactState from './state/contact';
import { useMedia } from './logic/useMedia';
import { useDisplay } from './state/settings';
import { useBrowserId, useLocalState } from './state/local';
import { ErrorAlert } from './components/ErrorAlert';
import { useErrorHandler } from './logic/useErrorHandler';
import useSchedulerStore, { useScheduler } from './state/scheduler';

const getNoteRedirect = (path: string) => {
  if (path.startsWith('/desk/')) {
    const [, , desk] = path.split('/');
    return `/apps/${desk}`;
  }

  if (path.startsWith('/landscape/')) {
    // Handle links to grid features (preferences, etc)
    const route = path
      .split('/')
      .filter((el) => el !== 'landscape')
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

function OldLeapRedirect() {
  const location = useLocation();
  const path = location.pathname.replace('/leap', '');
  return <Navigate to={path} />;
}

const AppRoutes = () => {
  const navigate = useNavigate();
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
    if (query.has('landscape-note')) {
      const redir = getNoteRedirect(query.get('landscape-note')!);
      navigate(redir);
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
      window.name = 'landscape';

      const { fetchDefaultAlly, fetchAllies, fetchCharges } =
        useDocketState.getState();
      fetchDefaultAlly();
      fetchCharges();
      fetchAllies();

      const { initializeKiln } = useKilnState.getState();
      initializeKiln();

      useSchedulerStore
        .getState()
        .wait(() => useContactState.getState().start(), 5);

      Mousetrap.bind(['command+/', 'ctrl+/'], () => {
        navigate('/search');
      });
    }),
    []
  );

  return (
    <Routes>
      <Route path="perma/*" element={<PermalinkRoutes />} />
      <Route path="leap/*" element={<OldLeapRedirect />} />
      <Route path="/" element={<Grid />}>
        <Route path=":menu/*" element={<Grid />} />
      </Route>
    </Routes>
  );
};

function Scheduler() {
  useScheduler();
  return null;
}

export function App() {
  const base = import.meta.env.MODE === 'mock' ? undefined : '/apps/landscape';

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
