const API_URL = 'https://localhost:7011/api';
export const createTokenUri = `${API_URL}/users/login`;
export const createUserUri = `${API_URL}/users`;
export const getUsersUri = `${API_URL}/users`;
export const getUserByNicUri = (nic: number) => `${API_URL}/users/${nic}`;

//export const getUserUri = (nic: number) => `${API_URL}/users/${nic}`;
export const suspendUserUri = `${API_URL}/users/suspension`;
export const getUserSuspensionByNicUri = (nic: number) => `${API_URL}/users/suspension/${nic}`;
export const deleteUserUri = `${API_URL}/users/`;
export const getFormUri = `${API_URL}/forms/structure`;
export const getDrugsAndDiseases = `${API_URL}/dnd`;
export const editFormUri = `${API_URL}/forms/structure`;

export const submitFormUri = (nic: number) => `${API_URL}/forms/submissions/${nic}`;
export const getSubmissionByUserUri = (nic: number) => `${API_URL}/forms/submissions/${nic}`;
export const getSubmissionsHistoryByUserUri = (nic: number, skip: number, limit: number) =>
  `${API_URL}/forms/submissions/history/${nic}?skip=${skip}&limit=${limit}`;
export const reviewSubmissionUri = (submissionId: number) => `${API_URL}/forms/review/${submissionId}`;
export const notesFromReviewUri = (reviewId: number) => `${API_URL}/forms/review/${reviewId}/notes`;
export const getInconsistenciesUri = `${API_URL}/forms/inconsistencies`;
export const editInconsistenciesUri = `${API_URL}/forms/inconsistencies`;

export const getTermsUri = `${API_URL}/terms`;
export const getActiveTermsUri = `${API_URL}/terms/active`;
export const updateTermsUri = (termsId: number) => `${API_URL}/terms/${termsId}`;

export const searchMedicationsUri = `${API_URL}/medications/search?q=`;

export const getManualInformationUri = (product: string) => `${API_URL}/manual/${product}`;
