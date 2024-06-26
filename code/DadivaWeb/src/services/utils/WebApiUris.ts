const API_URL = 'https://localhost:7011/api';
export const createTokenUri = `${API_URL}/users/login`;
export const createUserUri = `${API_URL}/users`;
export const getUsersUri = `${API_URL}/users`;

//export const getUserUri = (nic: number) => `${API_URL}/users/${nic}`;
export const deleteUserUri = `${API_URL}/users/`;
export const getFormUri = `${API_URL}/forms/structure`;
export const getDrugsAndDiseases = `${API_URL}/dnd`;
export const editFormUri = `${API_URL}/forms/structure`;

export const submitFormUri = (nic: number) => `${API_URL}/forms/submissions/${nic}`;
export const getSubmissionsByUserUri = (nic: number) => `${API_URL}/forms/submissions/${nic}`;
export const reviewSubmissionUri = (submissionId: number) => `${API_URL}/forms/review/${submissionId}`;
export const getInconsistenciesUri = `${API_URL}/forms/inconsistencies`;
export const editInconsistenciesUri = `${API_URL}/forms/inconsistencies`;
