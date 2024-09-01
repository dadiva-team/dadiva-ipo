import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUpdateSessionStatus } from '../../../session/Session';
import { SuspensionType } from '../../../services/users/models/LoginOutputModel';
import { SubmitFormResponse } from '../utils/formUtils';
import { Question } from '../../../domain/Form/Form';

export function useReviewForm(onSubmitRequest: () => Promise<SubmitFormResponse>) {
  const nav = useNavigate();
  const updateSessionStatus = useUpdateSessionStatus();
  const [open, setOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [backdropOpen, setBackdropOpen] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);

  const handleOpen = (question: Question) => {
    setSelectedQuestion(question);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedQuestion(null);
    setOpen(false);
  };

  const handleSubmit = async () => {
    setBackdropOpen(true);

    const { success, submissionDate } = await onSubmitRequest();
    if (success && submissionDate) {
      setSnackbarOpen(true);
      setBackdropOpen(false);
      setSubmitDisabled(true);

      setTimeout(() => {
        updateSessionStatus(SuspensionType.PendingReview, submissionDate);
        nav('/');
      }, 4000);
    } else {
      setBackdropOpen(false);
      setSubmitDisabled(false);
    }
  };

  return {
    handleOpen,
    handleClose,
    handleSubmit,
    open,
    selectedQuestion,
    snackbarOpen,
    backdropOpen,
    submitDisabled,
    setSnackbarOpen,
  };
}
