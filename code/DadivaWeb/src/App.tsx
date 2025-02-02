import * as React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Login from './pages/authentication/Login';
import Register from './pages/authentication/Register';
import { Uris } from './utils/navigation/Uris';
import Home from './pages/home/Home';
import { Header } from './components/home/Header';
import { FormPage } from './pages/form/FormPage';
import { Backoffice } from './pages/backoffice/Backoffice';
import { EditTermsPage } from './pages/backoffice/EditTermsPage';
import { ManageUsersPage } from './components/backoffice/manageUsers/ManageUsersPage';
import { EditInconsistenciesPage } from './pages/backoffice/EditInconsistenciesPage';
import { EditFormPage } from './pages/backoffice/EditFormPage';
import { Role, useCurrentSession } from './session/Session';
import { Doctor } from './pages/doctor/Doctor';
import { DoctorSearch } from './pages/doctor/search/DoctorSearch';
import { Terms } from './pages/form/Terms';
import HOME = Uris.HOME;
import FORM = Uris.FORM;
import REGISTER = Uris.REGISTER;
import EDIT_FORM = Uris.EDIT_FORM;
import FORM_INFO = Uris.FORM_INFO;
import TERMS_CONDITIONS = Uris.TERMS_CONDITIONS;
import BACKOFFICE = Uris.BACKOFFICE;
import MANAGE_USERS = Uris.MANAGE_USERS;
import EDIT_INCONSISTENCIES = Uris.EDIT_INCONSISTENCIES;
import DOCTOR = Uris.DOCTOR;
import DOCTOR_SEARCH_NIC = Uris.DOCTOR_SEARCH_NIC;
//import DOCTOR_SEARCH_NAME = Uris.DOCTOR_SEARCH_NAME;
import LOGIN = Uris.LOGIN;
import DOCTOR_MEDICATION_INFORMATION = Uris.DOCTOR_MEDICATION_INFORMATION;
import DOCTOR_MEDICATION_SEARCH = Uris.DOCTOR_MEDICATION_SEARCH;
import { MedicationSearch } from './pages/doctor/medications/MedicationSearch';
import { MedicationInformation } from './pages/doctor/medications/MedicationInformation';
import { PendingSubmissions } from './pages/doctor/pendingSubmissions/PendingSubmissions';
import { StatsPage } from './components/backoffice/statistics/StatsPage';
import { SettingsPage } from './pages/backoffice/SettingsPage';
import { LanguageProvider } from './components/backoffice/LanguageProvider';
import SETTINGS = Uris.SETTINGS;

export default function App() {
  const user = useCurrentSession();

  interface ProtectedRouteProps {
    roles: Role[];
    children: React.ReactNode;
  }

  function ProtectedRoute({ roles, children }: ProtectedRouteProps) {
    const location = useLocation();
    console.log(user, roles);
    if (!user) {
      return <Navigate to={LOGIN + `?returnUrl=${location.pathname}`} />;
    }

    if (!roles.some(role => user.perms?.includes(role))) {
      return <Navigate to={HOME} />;
    }

    if (user?.accountStatus?.isActive) {
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
          <Route path={LOGIN} element={<Login />} />
          <Route path={REGISTER} element={<Register />} />
          <Route
            path={DOCTOR}
            element={
              <ProtectedRoute roles={[Role.DOCTOR, Role.ADMIN]}>
                <Doctor />
              </ProtectedRoute>
            }
          >
            <Route path="" element={<PendingSubmissions />} />
            {
              <Route path={DOCTOR_SEARCH_NIC} element={<DoctorSearch mode="nic" />} />
              /*<Route path={DOCTOR_SEARCH_NAME} element={<DoctorSearch mode="name" />} /> */
            }
            <Route path={DOCTOR_MEDICATION_INFORMATION} element={<MedicationInformation />} />
            <Route path={DOCTOR_MEDICATION_SEARCH} element={<MedicationSearch />} />
          </Route>
          <Route
            path={FORM_INFO}
            element={
              <ProtectedRoute roles={[Role.DONOR, Role.DOCTOR, Role.ADMIN]}>
                <Terms />
              </ProtectedRoute>
            }
          />
          <Route
            path={FORM}
            element={
              <ProtectedRoute roles={[Role.DONOR, Role.DOCTOR, Role.ADMIN]}>
                <FormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={BACKOFFICE}
            element={
              <ProtectedRoute roles={[Role.ADMIN]}>
                <LanguageProvider>
                  <Backoffice />
                </LanguageProvider>
              </ProtectedRoute>
            }
          >
            <Route path="" element={<StatsPage />} />
            <Route path={SETTINGS} element={<SettingsPage />} />
            <Route path={TERMS_CONDITIONS} element={<EditTermsPage />} />
            <Route path={EDIT_FORM} element={<EditFormPage />} />
            <Route path={MANAGE_USERS} element={<ManageUsersPage />} />
            <Route path={EDIT_INCONSISTENCIES} element={<EditInconsistenciesPage />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}
