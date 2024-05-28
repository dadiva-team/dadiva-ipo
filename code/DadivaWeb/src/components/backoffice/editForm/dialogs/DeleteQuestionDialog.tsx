import { DeleteConfirmDialog } from '../../../shared/DeleteConfirmDialog';

export interface DeleteQuestionDialogProps {
  open: boolean;
  questionText: string | null;
  onAnswer: (del: boolean) => void;
  onClose: () => void;
}

export function DeleteQuestionDialog({ open, questionText, onAnswer, onClose }: DeleteQuestionDialogProps) {
  return DeleteConfirmDialog({
    title: 'Apagar a questão?',
    confirmationText: 'Tem a certeza que deseja apagar a questão?',
    open: open,
    deletedText: questionText,
    onAnswer: onAnswer,
    onClose: onClose,
  });
}
