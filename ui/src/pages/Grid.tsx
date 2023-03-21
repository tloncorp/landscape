import React, { FunctionComponent, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Route, useHistory, useParams } from 'react-router-dom';
import { ErrorAlert } from '../components/ErrorAlert';
import LandscapeWayfinding from '../components/LandscapeWayfinding';
import { MenuState, Nav } from '../nav/Nav';
import useKilnState from '../state/kiln';
import { useCalm } from '../state/settings';
import { RemoveApp } from '../tiles/RemoveApp';
import { SuspendApp } from '../tiles/SuspendApp';
import { TileGrid } from '../tiles/TileGrid';

import { TileInfo } from '../tiles/TileInfo';

interface RouteProps {
  menu?: MenuState;
}

export const Grid: FunctionComponent = () => {
  const { push } = useHistory();
  const { menu } = useParams<RouteProps>();
  const { disableWayfinding } = useCalm();

  useEffect(() => {
    // TOOD: rework
    // Heuristically detect reload completion and redirect
    async function attempt(count = 0) {
      if (count > 5) {
        window.location.reload();
      }
      const start = performance.now();
      await useKilnState.getState().fetchPikes();
      await useKilnState.getState().fetchPikes();
      if (performance.now() - start > 5000) {
        attempt(count + 1);
      } else {
        push('/');
      }
    }
    if (menu === 'upgrading') {
      attempt();
    }
  }, [menu]);

  return (
    <div className="flex h-screen w-full flex-col">
      {/* !disableWayfinding && <LandscapeWayfinding /> */}
      <header className="fixed bottom-0 left-0 z-30 flex w-full justify-center px-4 sm:sticky sm:bottom-auto sm:top-0">
        <Nav menu={menu} />
      </header>

      <main className="relative z-0 flex h-full w-full justify-center pt-4 pb-32 md:pt-16">
        <TileGrid menu={menu} />
        <ErrorBoundary FallbackComponent={ErrorAlert} onReset={() => push('/')}>
          <Route exact path="/app/:desk">
            <TileInfo />
          </Route>
          <Route exact path="/app/:desk/suspend">
            <SuspendApp />
          </Route>
          <Route exact path="/app/:desk/remove">
            <RemoveApp />
          </Route>
        </ErrorBoundary>
      </main>
    </div>
  );
};
