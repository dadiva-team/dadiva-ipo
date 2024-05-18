import { DeleteConfirmDialog } from './DeleteConfirmDialog';

export interface DeleteGroupDialogProps {
  open: boolean;
  groupName: string | null;
  onAnswer: (del: boolean) => void;
  onClose: () => void;
}

export function DeleteGroupDialog({ open, groupName, onAnswer, onClose }: DeleteGroupDialogProps) {
  return DeleteConfirmDialog({
    title: 'Apagar o grupo?',
    confirmationText: 'Tem a certeza que deseja apagar o grupo?',
    open: open,
    deletedText: groupName,
    onAnswer: onAnswer,
    onClose: onClose,
  });
}
