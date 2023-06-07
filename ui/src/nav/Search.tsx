import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { TreatyInfo } from './search/TreatyInfo';
import { Apps } from './search/Apps';
import { Home } from './search/Home';
import { Providers } from './search/Providers';
import { ErrorAlert } from '../components/ErrorAlert';

export const Search = () => {
  const navigate = useNavigate();
  return (
    <ErrorBoundary
      FallbackComponent={ErrorAlert}
      onReset={() => navigate('/leap/search')}
    >
      <div className="flex h-full w-full flex-col p-4">
        <Routes>
          <Route path="direct/apps/:host/:desk" element={<TreatyInfo />} />
          <Route path=":ship/apps/:host/:desk" element={<TreatyInfo />} />
          <Route path=":ship/apps" element={<Apps />} />
          <Route path=":ship" element={<Providers />} />
          <Route index element={<Home />} />
        </Routes>
      </div>
    </ErrorBoundary>
  );
};
