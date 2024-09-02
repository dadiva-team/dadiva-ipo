import { useState } from 'react';
import { Note } from '../../../../domain/Submission/Submission';
import { QuestionModel } from '../../../../services/doctors/models/SubmissionOutputModel';

interface UsePendingSubmissionAnswersProps {
  notes: Note[];
  handleSaveNote: (questionId: string, noteContent: string) => void;
}

export function usePendingSubmissionAnswers({ notes, handleSaveNote }: UsePendingSubmissionAnswersProps) {
  const [open, setOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionModel | null>(null);

  const handleClickOpen = (question: QuestionModel) => {
    setSelectedQuestion(question);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedQuestion(null);
  };

  const saveNote = (noteContent: string) => {
    if (selectedQuestion) {
      handleSaveNote(selectedQuestion.id, noteContent);
      handleClose();
    }
  };

  const getNoteContent = (id: string): string => {
    const note = notes?.find(note => note.id === id);
    return note ? note.note : null;
  };

  return {
    open,
    selectedQuestion,
    handleClickOpen,
    handleClose,
    saveNote,
    getNoteContent,
  };
}
