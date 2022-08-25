import cookies from 'browser-cookies';
import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './app';
import { IS_MOCK } from './state/api';
import './styles/index.css';

function authRedirect() {
  document.location = `${document.location.protocol}//${document.location.host}`;
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
    authRedirect();
  }
}

checkIfLoggedIn();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('app')
);
