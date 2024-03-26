import React from 'react';
import { createRoot } from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import Login from './components/authentication/Login/Login';

const root = createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <BrowserRouter>
		<Login/>
    </BrowserRouter>
);