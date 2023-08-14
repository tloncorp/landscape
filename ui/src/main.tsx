import { preSig } from '@urbit/aura';
import cookies from 'browser-cookies';
import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './app';
import { IS_MOCK } from './api';
import './styles/index.css';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import queryClient, { indexedDBPersistor } from './query-client';

window.our = `~${window.ship}`;

function authRedirect() {
  document.location.href = `${document.location.protocol}//${document.location.host}`;
}

function checkIfLoggedIn() {
  if (IS_MOCK) {
    return;
  }

  if (!('ship' in window)) {
    authRedirect();
  }

  const session = cookies.get(`urbauth-~${window.ship}`);
  if (!session) {
    fetch('/~/name')
      .then((res) => res.text())
      .then((name) => {
        if (name !== preSig(window.ship)) {
          authRedirect();
        }
      })
      .catch(() => {
        authRedirect();
      });
  }
}

checkIfLoggedIn();

ReactDOM.render(
  <React.StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: indexedDBPersistor(`${window.our}-landscape`),
      }}
    >
      <App />
    </PersistQueryClientProvider>
  </React.StrictMode>,
  document.getElementById('app')
);
