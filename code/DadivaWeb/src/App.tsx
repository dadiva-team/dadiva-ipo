import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/authentication/Login';
import Register from './pages/authentication/Register';
import { Uris } from './utils/navigation/Uris';
import Home from './pages/home/Home';
import HOME = Uris.HOME;
import LOGIN = Uris.LOGIN;
import FORM = Uris.FORM;
import REGISTER = Uris.REGISTER;
import EDIT_FORM = Uris.EDIT_FORM;
import { Header } from './components/home/Header';
import FORM_INFO = Uris.FORM_INFO;
import { FormInfo } from './pages/form/FormInfo';
import { EditFormPage } from './components/backoffice/editForm/EditFormPage';
import { Form } from './pages/form/Form';
import BACKOFFICE = Uris.BACKOFFICE;
import { Backoffice } from './pages/backoffice/Backoffice';
import { BackofficeMockChart } from './components/backoffice/BackofficeMockChart';

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
                <Form />
              </ProtectedRoute>
            }
          />
          <Route
            path={BACKOFFICE}
            element={
              <ProtectedRoute>
                <Backoffice />
              </ProtectedRoute>
            }
          >
            <Route path="" element={<BackofficeMockChart />} />
            <Route path={EDIT_FORM} element={<EditFormPage />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}
