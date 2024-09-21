import { useState, useEffect } from 'react';
import { Note } from '../../../../domain/Submission/Submission';
import { useLocation, useNavigate } from 'react-router-dom';
import { handleRequest, handleError } from '../../../../services/utils/fetch';
import { ReviewFormRequestModel } from '../../../../services/doctors/models/ReviewFormRequestModel';
import { DoctorServices } from '../../../../services/doctors/DoctorServices';
import {
  SubmissionAnsweredQuestionModel,
  SubmissionModel,
} from '../../../../services/doctors/models/SubmissionOutputModel';
import { checkInconsistencies } from '../utils/DoctorSearchUtils';
import { Uris } from '../../../../utils/navigation/Uris';
import DOCTOR_SEARCH_NIC = Uris.DOCTOR_SEARCH_NIC;

interface useDonorPendingSubmissionProps {
  submission: SubmissionModel;
  onSubmittedSuccessfully: () => void;
}

export function useDonorPendingSubmission({ submission, onSubmittedSuccessfully }: useDonorPendingSubmissionProps) {
  const nav = useNavigate();
  const location = useLocation();

  const [error, setError] = useState<string | null>(null);

  const [formWithAnswers, setFormWithAnswers] = useState<SubmissionAnsweredQuestionModel[]>(null);
  const [inconsistencies, setInconsistencies] = useState<string[][]>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<boolean | null>(null);
  const [finalNote, setFinalNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    console.log('submission', submission);
    console.log('inconsistencies', submission.inconsistencies);
    setFormWithAnswers(submission.answeredQuestions);
    if (submission?.inconsistencies) {
      setInconsistencies(checkInconsistencies(submission.answeredQuestions, submission?.inconsistencies));
    }
  }, [submission]);

  const handleSaveNote = (questionId: string, noteContent: string) => {
    setNotes(prevNotes => {
      const noteIndex = prevNotes?.findIndex(note => note.id === questionId);
      if (noteIndex > -1) {
        prevNotes[noteIndex].note = noteContent;
      } else {
        prevNotes.push({ id: questionId, note: noteContent });
      }
      return [...prevNotes];
    });
  };

  const handleDialogOpen = (type: boolean) => {
    setDialogType(type);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setDialogType(null);
    setFinalNote('');
  };

  const handleDialogSubmit = async (suspend: boolean, openProfileAfterReject: boolean) => {
    setIsSubmitting(true);
    await submitReview(dialogType, suspend, openProfileAfterReject, finalNote);
    handleDialogClose();
    setIsSubmitting(false);
  };

  const submitReview = async (
    status: boolean,
    suspend: boolean,
    openProfileAfterReject: boolean,
    finalNote?: string
  ) => {
    console.log('submitting review');
    const reviewData = {
      status,
      finalNote,
      notes: notes.map(note => ({
        questionId: note.id,
        noteText: note.note,
      })),
      suspend,
    } as ReviewFormRequestModel;

    const [error, res] = await handleRequest(DoctorServices.reviewSubmission(submission.id, reviewData));
    if (error) {
      handleError(error, setError, nav, location.pathname);
      return;
    }
    console.log(res);
    if (res) {
      console.log('Review submitted successfully');
      onSubmittedSuccessfully();
      console.log('openProfileAfterReject', openProfileAfterReject);
      if (openProfileAfterReject) {
        window.open(DOCTOR_SEARCH_NIC + `?nic=${submission.donor.nic}`);
      }
    }
  };

  return {
    error,
    formWithAnswers,
    inconsistencies,
    notes,
    showDetails,
    dialogOpen,
    dialogType,
    finalNote,
    isSubmitting,
    setError,
    setShowDetails,
    handleSaveNote,
    handleDialogOpen,
    handleDialogClose,
    handleDialogSubmit,
    setFinalNote,
    submitReview,
  };
}
