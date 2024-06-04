import * as React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/authentication/Login';
import Register from './pages/authentication/Register';
import { Uris } from './utils/navigation/Uris';
import Home from './pages/home/Home';
import { Header } from './components/home/Header';
import { FormInfo } from './pages/form/FormInfo';
import { Form } from './pages/form/Form';
import { Backoffice } from './pages/backoffice/Backoffice';
import { BackofficeMockChart } from './components/backoffice/BackofficeMockChart';
import { ManageUsersPage } from './components/backoffice/manageUsers/ManageUsersPage';
import { EditInconsistenciesPage } from './pages/backoffice/EditInconsistenciesPage';
import { EditFormPage } from './pages/backoffice/EditFormPage';
import { Role, useCurrentSession } from './session/Session';
import { Doctor } from './pages/doctor/Doctor';
import { DoctorSearch } from './pages/doctor/search/DoctorSearch';
import HOME = Uris.HOME;
import FORM = Uris.FORM;
import REGISTER = Uris.REGISTER;
import EDIT_FORM = Uris.EDIT_FORM;
import FORM_INFO = Uris.FORM_INFO;
import BACKOFFICE = Uris.BACKOFFICE;
import MANAGE_USERS = Uris.MANAGE_USERS;
import EDIT_INCONSISTENCIES = Uris.EDIT_INCONSISTENCIES;
import DOCTOR = Uris.DOCTOR;
import DOCTOR_SEARCH_NIC = Uris.DOCTOR_SEARCH_NIC;
import DOCTOR_SEARCH_NAME = Uris.DOCTOR_SEARCH_NAME;

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

    if (!roles.includes(user.perms)) {
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
            path={DOCTOR}
            element={
              <ProtectedRoute roles={[Role.DOCTOR, Role.ADMIN]}>
                <Doctor />
              </ProtectedRoute>
            }
          >
            <Route path={DOCTOR_SEARCH_NIC} element={<DoctorSearch mode="nic" />} />
            <Route path={DOCTOR_SEARCH_NAME} element={<DoctorSearch mode="name" />} />
          </Route>
          <Route
            path={FORM_INFO}
            element={
              <ProtectedRoute roles={[Role.DONOR, Role.DOCTOR, Role.ADMIN]}>
                <FormInfo />
              </ProtectedRoute>
            }
          />
          <Route
            path={FORM}
            element={
              <ProtectedRoute roles={[Role.DONOR, Role.DOCTOR, Role.ADMIN]}>
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
