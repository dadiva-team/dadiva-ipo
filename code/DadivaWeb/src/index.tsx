import { createRoot } from 'react-dom/client';
import React from 'react';
import { AuthnContainer } from './session/Session';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <BrowserRouter>
    <AuthnContainer>
      <App />
    </AuthnContainer>
  </BrowserRouter>
);
