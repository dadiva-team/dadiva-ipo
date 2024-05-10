import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './components/authentication/Login/Login';
import Register from './components/authentication/Register';
import { Uris } from './utils/navigation/Uris';
import Home from './components/home/Home';
import HOME = Uris.HOME;
import LOGIN = Uris.LOGIN;
import FORM = Uris.FORM;
import REGISTER = Uris.REGISTER;
import BACK_OFFICE = Uris.BACK_OFFICE;
import FormWithRuleEngine from './components/form/FormWithRuleEngine';
import { Header } from './components/home/Header';
import FORM_INFO = Uris.FORM_INFO;
import { FormInfo } from './components/form/FormInfo';
import { Backoffice } from './components/backoffice/Backoffice';

export default function App() {
  //const loggedIn = useLoggedIn();

  function ProtectedRoute({ children }: { children: React.ReactNode }) {
    /*if (!loggedIn) {
      return <Login />;
    }*/
    return children;
  }

  return (
    <div className="App">
      <div className="App-content">
        <Header />
        <Routes>
          <Route path={HOME} element={<Home />} />
          <Route path={LOGIN} element={<Login />} />
          <Route path={REGISTER} element={<Register />} />
          <Route path={FORM_INFO} element={<FormInfo />} />
          <Route
            path={FORM}
            element={
              <ProtectedRoute>
                <FormWithRuleEngine />
              </ProtectedRoute>
            }
          />
          <Route path={BACK_OFFICE} element={<Backoffice />} />
        </Routes>
      </div>
    </div>
  );
}
