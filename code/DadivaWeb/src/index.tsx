import { createRoot } from 'react-dom/client';
import React from 'react';
import { AuthnContainer } from './session/Session';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <BrowserRouter>
    <I18nextProvider i18n={i18n}>
      <AuthnContainer>
        <App />
      </AuthnContainer>
    </I18nextProvider>
  </BrowserRouter>
);
