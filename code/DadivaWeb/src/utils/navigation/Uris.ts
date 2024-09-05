export namespace Uris {
  export const HOME = '/';

  export const PROFILE = '/me';
  export const LOGIN = '/login';
  export const REGISTER = '/register';

  export const FORM_INFO = '/form-info';

  export const FORM = 'form';
  export const BACKOFFICE = '/backoffice';
  export const STATISTICS = '/backoffice/statistics';
  export const TERMS_CONDITIONS = '/backoffice/terms-conditions';
  export const EDIT_FORM = '/backoffice/form';
  export const MANAGE_USERS = '/backoffice/users';
  export const SETTINGS = '/backoffice/settings';

  export const EDIT_INCONSISTENCIES = '/backoffice/inconsistencies';

  export const DOCTOR = '/doctor';
  export const DOCTOR_SEARCH_NAME = '/doctor/search-name';
  export const DOCTOR_SEARCH_NIC = '/doctor/search-nic';

  export const DOCTOR_MEDICATION_SEARCH = '/doctor/medications/search';
  export const DOCTOR_MEDICATION_INFORMATION = `/doctor/medications/information/:product`;
  export const DOCTOR_MEDICATION_INFORMATION_COMPLETE = (product: string) =>
    `/doctor/medications/information/${product}`;

  export const DONOR_HISTORY = (donorNIC: string) => `/donors/${donorNIC}/history`;
  export const DONOR_FORM = (donorNIC: string, formId: string) => `/donors/${donorNIC}/forms/${formId}`;
}
