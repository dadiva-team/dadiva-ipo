const API_URL = 'https://localhost:7011/api';
export const createTokenUri = `${API_URL}/users/login`;
export const revokeTokenUri = `${API_URL}/users/logout`;
export const createUserUri = `${API_URL}/users`;
export const getUsersUri = `${API_URL}/users`;
export const getUserByNicUri = (nic: number) => `${API_URL}/users/${nic}`;

//export const getUserUri = (nic: number) => `${API_URL}/users/${nic}`;
export const suspendUserUri = `${API_URL}/users/suspension`;
export const getUserSuspensionByNicUri = (nic: number) => `${API_URL}/users/suspension/${nic}`;
export const getUserSuspensionHistoryByNicUri = (nic: number) => `${API_URL}/users/suspension/${nic}/history`;
export const deleteUserUri = `${API_URL}/users/`;
export const getFormUri = (language: string) => `${API_URL}/forms/structure/${language}`;
export const getDrugsAndDiseases = `${API_URL}/dnd`;
export const editFormUri = `${API_URL}/forms/structure`;

export const submitFormUri = `${API_URL}/submissions`;
export const getSubmissionByUserUri = (nic: string) => `${API_URL}/submissions/pending/${nic}`;
export const getSubmissionHistoryByUserUri = (nic: number, skip: number, limit: number) =>
  `${API_URL}/submissions/history/${nic}?skip=${skip}&limit=${limit}`;

export const lockSubmissionUri = (submissionId: number) => `${API_URL}/submissions/${submissionId}/lock`;
export const unlockSubmissionUri = (submissionId: number) => `${API_URL}/submissions/${submissionId}/unlock`;
export const reviewSubmissionUri = (submissionId: number) => `${API_URL}/review/${submissionId}`;
export const notificationsUri = `${API_URL}/submissions/pending/notifications`;
export const notesFromReviewUri = (reviewId: number) => `${API_URL}/forms/review/${reviewId}/notes`;
export const getInconsistenciesUri = (language: string) => `${API_URL}/forms/inconsistencies/${language}`;
export const editInconsistenciesUri = `${API_URL}/forms/inconsistencies`;

export const getSubmissionsStatsUri = `${API_URL}/submissions/stats`;

//export const getTermsUri = `${API_URL}/terms`;
export const getTermsHistoryUri = (language: string) => `${API_URL}/terms/history/${language}`;
export const getActiveTermsUri = (language: string) => `${API_URL}/terms/${language}`;
export const updateTermsUri = `${API_URL}/terms`;

export const searchMedicationsUri = `${API_URL}/medications/search?q=`;

export const getManualInformationUri = (product: string) => `${API_URL}/manual/${product}`;

export const getPendingSubmissionsUri = `${API_URL}/submissions/pending`;
