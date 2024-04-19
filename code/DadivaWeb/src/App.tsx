import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './components/authentication/Login/Login';
import Register from './components/authentication/Register';
import Form from './components/form/Form';
import { Uris } from './utils/navigation/Uris';
import Home from './components/home/Home';
import HOME = Uris.HOME;
import LOGIN = Uris.LOGIN;
import FORM = Uris.FORM;
import REGISTER = Uris.REGISTER;
import RealForm from './components/form/RealForm';

export default function App() {
  return (
    <div>
      <div>
        <Routes>
          <Route path={HOME} element={<Home />} />
          <Route path={LOGIN} element={<Login />} />
          <Route path={REGISTER} element={<Register />} />

          <Route path={FORM} element={<Form />} />
          <Route path={FORM + 'aa'} element={<RealForm />} />
        </Routes>
      </div>
    </div>
  );
}
