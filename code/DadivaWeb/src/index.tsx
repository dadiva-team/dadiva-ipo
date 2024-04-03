import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import React from 'react';
import {AuthnContainer} from "./session/Session";
import App from "./App";

const root = createRoot(
    document.getElementById('root') as HTMLElement,
);
root.render(
    <BrowserRouter>
        <AuthnContainer>
            <App/>
        </AuthnContainer>
    </BrowserRouter>,
);