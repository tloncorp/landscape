import React, { FunctionComponent, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { ErrorAlert } from '../components/ErrorAlert';
import LandscapeWayfinding from '../components/LandscapeWayfinding';
import { MenuState, Nav } from '../nav/Nav';
import useKilnState from '../state/kiln';
import { useCalm } from '../state/settings';
import { RemoveApp } from '../tiles/RemoveApp';
import { SuspendApp } from '../tiles/SuspendApp';
import { TileGrid } from '../tiles/TileGrid';
import { TileInfo } from '../tiles/TileInfo';

export const Grid: FunctionComponent = () => {
  const navigate = useNavigate();
  const { menu } = useParams<{ menu: MenuState }>();
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
        navigate('/');
      }
    }
    if (menu === 'upgrading') {
      attempt();
    }
  }, [menu]);

  return (
    <div className="flex h-screen w-full flex-col">
      <header className="fixed bottom-0 left-0 z-30 flex w-full justify-center px-4 sm:sticky sm:bottom-auto sm:top-0">
        <Nav />
      </header>

      <main className="relative z-0 flex h-full w-full justify-center pt-4 pb-32 md:pt-16">
        <TileGrid menu={menu} />
        <ErrorBoundary
          FallbackComponent={ErrorAlert}
          onReset={() => navigate('/')}
        >
          <Routes>
            <Route path="app/:desk" element={<TileInfo/>}/>
            <Route path="app/:desk/suspend" element={<SuspendApp/>}/>
            <Route path="app/:desk/remove" element={<RemoveApp/>}/>
          </Routes>
        </ErrorBoundary>
        {!disableWayfinding && (
          <LandscapeWayfinding className="hidden sm:fixed sm:bottom-4 sm:left-4 sm:z-[100] sm:block" />
        )}
      </main>
    </div>
  );
};
