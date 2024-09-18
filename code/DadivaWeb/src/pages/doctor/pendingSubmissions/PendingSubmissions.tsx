import React, { useEffect, useState, useRef } from 'react';
import { handleError, handleRequest } from '../../../services/utils/fetch';
import { DoctorServices } from '../../../services/doctors/DoctorServices';
import LoadingSpinner from '../../../components/shared/LoadingSpinner';
import { SubmissionModel } from '../../../services/doctors/models/SubmissionOutputModel';
import { Alert, Box, IconButton, Paper, Snackbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ErrorAlert } from '../../../components/shared/ErrorAlert';
import { PendingSubmissionCard } from './PendingSubmissionCard';
import { useCurrentSession } from '../../../session/Session';
import { notificationsUri } from '../../../services/utils/WebApiUris';
import { SortOrder, SubmissionFilters } from './SubmissionFilters';
import { ViewMode } from '../search/donorReviews/DonorReviews';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

export function PendingSubmissions() {
  const nav = useNavigate();
  const doc = useCurrentSession();

  const [error, setError] = useState<string>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [pendingSubmissions, setPendingSubmissions] = useState<SubmissionModel[]>([]);
  const [lockedSubmissions, setLockedSubmissions] = useState<Set<number>>(new Set());

  const [currentReviewSubmission, setCurrentReviewSubmission] = useState<number | null>(null);
  const [forceCloseModal, setForceCloseModal] = useState(false);
  const [lockedByCurrentDoctor, setLockedByCurrentDoctor] = useState<SubmissionModel | null>(null);

  const currentReviewSubmissionRef = useRef(currentReviewSubmission);

  // ---------------------- SnackBar --------------------------------
  const [snackbarInfoOpen, setSnackbarInfoOpen] = useState(false);
  const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);
  // --------------------------------------------------------------------

  // ---------------------- View and Filters --------------------------------

  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Grid);
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.Desc);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filtersVisible, setFiltersVisible] = useState<boolean>(true);

  const handleViewModeChange = (newViewMode: ViewMode) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  const handleSortOrderChange = (newSortOrder: SortOrder) => {
    if (newSortOrder !== null) {
      setSortOrder(newSortOrder);
    }
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const toggleFiltersVisibility = () => {
    setFiltersVisible(!filtersVisible);
  };

  const filteredSubmissions = pendingSubmissions
    .filter(submission => {
      const submissionDate = new Date(submission.submissionDate);

      if (selectedDate) {
        return submissionDate.toDateString() === selectedDate.toDateString();
      }

      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.submissionDate);
      const dateB = new Date(b.submissionDate);
      return sortOrder === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    });

  // --------------------------------------------------------------------

  useEffect(() => {
    currentReviewSubmissionRef.current = currentReviewSubmission;
  }, [currentReviewSubmission]);

  useEffect(() => {
    const fetch = async () => {
      const [err, res] = await handleRequest(DoctorServices.getPendingSubmissions());
      if (err) {
        setIsLoading(false);
        handleError(err, setError, nav);
        return;
      }
      setPendingSubmissions(res.submissions as SubmissionModel[]);

      const newLockedSubmissions: Set<number> = new Set();
      for (const submission of res.submissions) {
        if (submission.lock != null && submission?.lock?.doctor.nic != doc?.nic.toString()) {
          newLockedSubmissions.add(submission.id);
        } else if (submission?.lock?.doctor.nic == doc?.nic.toString()) {
          setLockedByCurrentDoctor(submission);
        }
      }

      setLockedSubmissions(newLockedSubmissions);
      setIsLoading(false);
      console.log('Submissions:', res.submissions);
    };
    if (pendingSubmissions.length === 0) {
      fetch();
    }
  }, [doc.nic, nav, pendingSubmissions.length]);

  useEffect(() => {
    console.log('Opening connection to SSE. ', notificationsUri);

    const eventSource = new EventSource(notificationsUri);
    eventSource.onopen = () => {
      console.log('Connection to SSE opened.');
    };

    eventSource.onmessage = event => {
      console.log('Message received:', event.data);
      const data = JSON.parse(event.data);
      if (data.type === 'lock' || data.type === 'unlock') {
        setLockedSubmissions(prev => {
          const newSet = new Set(prev);
          if (data.type === 'lock') {
            newSet.add(data.submissionId);
          } else {
            newSet.delete(data.submissionId);
            if (data.reason === 'timeout' && currentReviewSubmissionRef.current === data.submissionId) {
              alert(`O tempo de revisão da submissão expirou.`);
              setForceCloseModal(true);
              setLockedByCurrentDoctor(null);
            }
          }
          console.log('Updated locked submissions:', newSet);
          return newSet;
        });
      }
      if (data.type === 'review') {
        setSnackbarInfoOpen(true);
        setPendingSubmissions(prev => prev.filter(submission => submission.id !== data.submissionId));
      }
    };

    eventSource.onerror = error => {
      console.error('EventSource failed:', error);
      // Handle error but don't close the connection
    };

    return () => {
      console.log('Component unmounted, closing connection to SSE.');
      eventSource.close();
    };
  }, []);

  const handleOpenReview = (submissionId: number) => {
    setCurrentReviewSubmission(submissionId);
  };

  const handleCloseReview = () => {
    setCurrentReviewSubmission(null);
    setForceCloseModal(false);
  };

  return (
    <>
      {isLoading ? (
        <LoadingSpinner text={'A Carregar Submissões...'} />
      ) : (
        <Paper sx={{ p: 2 }}>
          {lockedByCurrentDoctor ? (
            <>
              <Typography variant="h6" sx={{ p: 1, pb: 2, color: 'warning.main' }}>
                Tem uma revisão por concluir ...
              </Typography>
              <Box>
                <PendingSubmissionCard
                  submission={lockedByCurrentDoctor}
                  locked={false}
                  doctorNic={doc.nic}
                  isReviewing={currentReviewSubmission === lockedByCurrentDoctor.id}
                  onSubmittedSuccessfully={() => {
                    setLockedByCurrentDoctor(null);
                  }}
                  onOpenReview={() => handleOpenReview(lockedByCurrentDoctor.id)}
                  onCloseReview={() => {
                    handleCloseReview();
                    setLockedByCurrentDoctor(null);
                  }}
                  forceCloseModal={forceCloseModal}
                />
              </Box>
            </>
          ) : (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ p: 1, pb: 2 }}>
                  Submissões Pendentes
                </Typography>
                <IconButton onClick={toggleFiltersVisibility}>
                  {filtersVisible ? <FilterAltOffIcon /> : <FilterAltIcon />}
                </IconButton>
              </Box>
              <SubmissionFilters
                sortOrder={sortOrder}
                layout={viewMode}
                filtersVisible={filtersVisible}
                selectedDate={selectedDate}
                pendingSubmissions={pendingSubmissions}
                onSortOrderChange={handleSortOrderChange}
                onLayoutChange={handleViewModeChange}
                onDateChange={handleDateChange}
                onToggleFiltersVisibility={toggleFiltersVisibility}
              />
              {error && <ErrorAlert error={error} clearError={() => setError(null)} />}
              <Box
                sx={{
                  display: viewMode === ViewMode.Grid ? 'grid' : 'block',
                  gridTemplateColumns: viewMode === ViewMode.Grid ? 'repeat(2, 1fr)' : 'none',
                  gap: 2,
                }}
              >
                {filteredSubmissions.map(submission => (
                  <Box
                    key={submission.id}
                    sx={{
                      border: '1px solid',
                      borderColor: 'grey.300',
                      borderRadius: 2,
                      p: 2,
                      mb: 2,
                    }}
                  >
                    <PendingSubmissionCard
                      submission={submission}
                      locked={lockedSubmissions.has(submission.id)}
                      onSubmittedSuccessfully={() => {
                        console.log('Submission reviewed successfully.');
                        setSnackbarSuccessOpen(true);
                      }}
                      doctorNic={doc.nic}
                      isReviewing={currentReviewSubmission === submission.id}
                      onOpenReview={() => handleOpenReview(submission.id)}
                      onCloseReview={handleCloseReview}
                      forceCloseModal={forceCloseModal}
                    />
                  </Box>
                ))}
              </Box>
            </>
          )}
        </Paper>
      )}
      <Snackbar
        open={snackbarSuccessOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarSuccessOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarSuccessOpen(false)} severity="success" sx={{ width: '100%' }}>
          {'Revisão submetida com sucesso!'}
        </Alert>
      </Snackbar>
      <Snackbar
        open={snackbarInfoOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarInfoOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarInfoOpen(false)} severity="info" sx={{ width: '100%' }}>
          {'Houve uma atualização na lista de submissões.'}
        </Alert>
      </Snackbar>
    </>
  );
}
