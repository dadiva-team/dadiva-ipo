import React from 'react';
import { Box, Paper } from '@mui/material';
import { DonorSearchName } from './DoctorSearchName';
import { DonorSearchNic } from './DoctorSearchNic';
import { DoctorSearchButtons } from './DoctorSearchButtons';
import { ErrorAlert } from '../../../components/shared/ErrorAlert';
import LoadingSpinner from '../../../components/shared/LoadingSpinner';
import { PendingSubmissionResults } from './pendingSubmission/PendingSubmissionResults';
import { useDoctorSearch } from './useDoctorSearch';
import { DonorSuspension } from './donorSuspension/DonorSuspension';
import { OldSubmissionsResults } from './oldSubmissions/OldSubmissionsResults';

export interface DoctorSearchProps {
  mode: string;
}

export function DoctorSearch({ mode }: DoctorSearchProps) {
  const {
    error,
    errorForm,
    errorSubmission,
    isLoading,
    nic,
    pendingSubmission,
    reviewsHistory,
    user,
    fetchedSuspension,
    pendingView,
    reviewHistoryView,
    hasMoreSubmissions,
    suspensionView,
    setNic,
    setError,
    setErrorForm,
    setErrorSubmission,
    fetchPendingSubmission,
    fetchReviewHistory,
    fetchSuspension,
    loadMoreReviews,
    togglePendingView,
    toggleOldView,
    toggleSuspensionView,
    handleSearchAndUpdateQuery,
    onSubmitedSuccessfully,
  } = useDoctorSearch();

  return (
    <Box sx={{ pr: 1 }}>
      {mode === 'name' ? (
        <Box>
          <DonorSearchName />
        </Box>
      ) : (
        <Box>
          {errorForm && <ErrorAlert error={errorForm} clearError={() => setErrorForm(null)} />}
          <DonorSearchNic nic={nic} setNic={setNic} handleSearch={handleSearchAndUpdateQuery} isSearching={isLoading} />
        </Box>
      )}
      {error && <ErrorAlert error={error} clearError={() => setError(null)} />}
      {isLoading && <LoadingSpinner text={'A carregar...'} />}
      {user && (
        <Paper elevation={2} sx={{ padding: 2, display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
          <DoctorSearchButtons
            user={user}
            pendingView={pendingView}
            historyView={reviewHistoryView}
            onCheckPendingSubmission={fetchPendingSubmission}
            onCheckOldSubmissions={reset => fetchReviewHistory(2, 0, reset)} //TODO: Tirar o hardcode do limit e skip
            onCheckSuspension={fetchSuspension}
            pendingAndOldView={pendingSubmission && reviewsHistory?.length > 0}
            onTogglePendingView={togglePendingView}
            onToggleHistoryView={toggleOldView}
            onToggleSuspensionView={toggleSuspensionView}
          />
          <Box sx={{ marginLeft: 2, width: '80%', borderLeft: '6px solid #1976d2', pl: 2 }}>
            {errorSubmission && <ErrorAlert error={errorSubmission} clearError={() => setErrorSubmission(null)} />}
            {pendingView && pendingSubmission && (
              <PendingSubmissionResults
                submission={pendingSubmission}
                onSubmittedSuccessfully={onSubmitedSuccessfully}
              />
            )}
            {reviewHistoryView && reviewsHistory && (
              <OldSubmissionsResults
                submissions={reviewsHistory}
                loadMoreSubmissions={loadMoreReviews}
                hasMoreSubmissions={hasMoreSubmissions}
              />
            )}
            {suspensionView && (
              <DonorSuspension
                nic={user.nic}
                fetchedSuspension={fetchedSuspension}
                onSubmittedSuccessfully={onSubmitedSuccessfully}
              />
            )}
          </Box>
        </Paper>
      )}
    </Box>
  );
}
