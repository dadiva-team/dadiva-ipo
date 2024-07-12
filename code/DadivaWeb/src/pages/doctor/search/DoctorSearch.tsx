import React from 'react';
import {Box, Paper} from '@mui/material';
import {DonorSearchName} from './DoctorSearchName';
import {DonorSearchNic} from './DoctorSearchNic';
import {DoctorSearchButtons} from './DoctorSearchButtons';
import {ErrorAlert} from '../../../components/shared/ErrorAlert';
import LoadingSpinner from '../../../components/shared/LoadingSpinner';
import {PendingSubmissionResults} from './pendingSubmission/PendingSubmissionResults';
import {OldSubmissionsResults} from "./oldSubmissions/OldSubmissionsResults";
import {useDoctorSearch} from './useDoctorSearch';

export interface DoctorSearchProps {
    mode: string;
}

export function DoctorSearch({mode}: DoctorSearchProps) {
    const {
        error,
        errorForm,
        errorSubmission,
        isLoading,
        nic,
        pendingSubmission,
        oldSubmissions,
        user,
        formGroupsCache,
        inconsistencies,
        pendingView,
        oldView,
        hasMoreSubmissions,
        setNic,
        setError,
        setErrorForm,
        setErrorSubmission,
        fetchUser,
        fetchPendingSubmission,
        fetchSubmissionHistory,
        loadMoreSubmissions,
        togglePendingView,
        toggleOldView,
    } = useDoctorSearch();

    return (
        <Box sx={{pr: 1}}>
            {mode === 'name' ? (
                <Box>
                    <DonorSearchName/>
                </Box>
            ) : (
                <Box>
                    {errorForm && <ErrorAlert error={errorForm} clearError={() => setErrorForm(null)}/>}
                    <DonorSearchNic
                        nic={nic}
                        setNic={setNic}
                        handleSearch={fetchUser}
                        isSearching={isLoading}
                    />
                </Box>
            )}
            {error && <ErrorAlert error={error} clearError={() => setError(null)}/>}
            {isLoading && <LoadingSpinner text={'A carregar...'}/>}
            {user && (
                <Paper elevation={2} sx={{padding: 2, display: 'flex', flexDirection: 'row', alignItems: 'flex-start'}}>
                    <DoctorSearchButtons
                        user={user}
                        pendingView={pendingView}
                        historyView={oldView}
                        onCheckPendingSubmission={fetchPendingSubmission}
                        onCheckOldSubmissions={(reset) => fetchSubmissionHistory(2, 0, reset)}  //TODO: Tirar o hardcode do limit e skip
                        pendingAndOldView={!!pendingSubmission && oldSubmissions?.size > 0}
                        onTogglePendingView={togglePendingView}
                        onToggleHistoryView={toggleOldView}
                    />
                    <Box sx={{marginLeft: 2, width: '80%', borderLeft: '6px solid #1976d2', pl: 2}}>
                        {errorSubmission &&
                            <ErrorAlert error={errorSubmission} clearError={() => setErrorSubmission(null)}/>
                        }
                        {pendingView && pendingSubmission && (
                            <PendingSubmissionResults
                                formGroups={formGroupsCache?.get(pendingSubmission.formVersion) || []}
                                inconsistencies={inconsistencies || []}
                                submission={pendingSubmission}
                            />
                        )}
                        {oldView && oldSubmissions && (
                            <OldSubmissionsResults
                                submissions={oldSubmissions}
                                inconsistencies={inconsistencies || []}
                                loadMoreSubmissions={loadMoreSubmissions}
                                hasMoreSubmissions={hasMoreSubmissions}
                            />
                        )}
                    </Box>
                </Paper>
            )}
        </Box>
    );
}
