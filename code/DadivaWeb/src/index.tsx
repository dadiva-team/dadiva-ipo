import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Login from './components/authentication/Login/Login';
import React from 'react';

const root = createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <BrowserRouter>
    <Login />
  </BrowserRouter>,
);