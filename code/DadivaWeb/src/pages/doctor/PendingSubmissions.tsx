import React, { useEffect, useState, useRef } from 'react';
import { handleError, handleRequest } from '../../services/utils/fetch';
import { DoctorServices } from '../../services/doctors/DoctorServices';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
//import { Group } from '../../domain/Form/Form';
import { SubmissionModel } from '../../services/doctors/models/SubmissionOutputModel';
import { Box, Divider, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ErrorAlert } from '../../components/shared/ErrorAlert';
import { PendingSubmissionCard } from './PendingSubmissionCard';
import { useCurrentSession } from '../../session/Session';
import { notificationsUri } from '../../services/utils/WebApiUris';
//import { Submission } from '../../domain/Submission/Submission';

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
                  onSubmitedSuccessfully={() => {
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
              <Typography variant="h6" sx={{ p: 1, pb: 2 }}>
                {' '}
                Submissões Pendentes{' '}
              </Typography>
              {error && <ErrorAlert error={error} clearError={() => setError(null)} />}
              {pendingSubmissions.map(submission => (
                <Box key={submission.id}>
                  <PendingSubmissionCard
                    submission={submission}
                    locked={lockedSubmissions.has(submission.id)}
                    onSubmitedSuccessfully={() => {}}
                    doctorNic={doc.nic}
                    isReviewing={currentReviewSubmission === submission.id}
                    onOpenReview={() => handleOpenReview(submission.id)}
                    onCloseReview={handleCloseReview}
                    forceCloseModal={forceCloseModal}
                  />
                  <Divider sx={{ p: 0.5 }} />
                </Box>
              ))}
            </>
          )}
        </Paper>
      )}
    </>
  );
}
