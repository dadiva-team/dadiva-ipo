import * as React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/authentication/Login';
import Register from './pages/authentication/Register';
import { Uris } from './utils/navigation/Uris';
import Home from './pages/home/Home';
import HOME = Uris.HOME;
import FORM = Uris.FORM;
import REGISTER = Uris.REGISTER;
import EDIT_FORM = Uris.EDIT_FORM;
import { Header } from './components/home/Header';
import FORM_INFO = Uris.FORM_INFO;
import { FormInfo } from './pages/form/FormInfo';
import { Form } from './pages/form/Form';
import BACKOFFICE = Uris.BACKOFFICE;
import { Backoffice } from './pages/backoffice/Backoffice';
import { BackofficeMockChart } from './components/backoffice/BackofficeMockChart';
import MANAGE_USERS = Uris.MANAGE_USERS;
import { ManageUsersPage } from './components/backoffice/manageUsers/ManageUsersPage';
import EDIT_INCONSISTENCIES = Uris.EDIT_INCONSISTENCIES;
import { EditInconsistenciesPage } from './pages/backoffice/EditInconsistenciesPage';
import { EditFormPage } from './pages/backoffice/EditFormPage';
import { Role, useCurrentSession } from './session/Session';

export default function App() {
  const user = useCurrentSession();

  interface ProtectedRouteProps {
    roles: Role[];
    children: React.ReactNode;
  }

  function ProtectedRoute({ roles, children }: ProtectedRouteProps) {
    console.log(user, roles);
    if (!user) {
      return <Login />;
    }

    if (!roles.includes(user.role)) {
      return <Navigate to={HOME} />;
    }

    return children;
  }

  return (
    <div className="App">
      <div className="App-content">
        <Header />
        <Routes>
          <Route path={HOME} element={<Home />} />
          <Route path={REGISTER} element={<Register />} />
          <Route
            path={FORM_INFO}
            element={
              <ProtectedRoute roles={[Role.DONOR]}>
                <FormInfo />
              </ProtectedRoute>
            }
          />
          <Route
            path={FORM}
            element={
              <ProtectedRoute roles={[Role.DONOR]}>
                <Form />
              </ProtectedRoute>
            }
          />
          <Route
            path={BACKOFFICE}
            element={
              <ProtectedRoute roles={[Role.ADMIN]}>
                <Backoffice />
              </ProtectedRoute>
            }
          >
            <Route path="" element={<BackofficeMockChart />} />
            <Route path={EDIT_FORM} element={<EditFormPage />} />
            <Route path={MANAGE_USERS} element={<ManageUsersPage />} />
            <Route path={EDIT_INCONSISTENCIES} element={<EditInconsistenciesPage />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}
