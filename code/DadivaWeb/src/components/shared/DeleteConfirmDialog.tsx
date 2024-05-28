import React from 'react';
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import Typography from '@mui/material/Typography';

export interface DeleteConfirmDialogProps {
  title: string;
  confirmationText: string;
  open: boolean;
  deletedText: string | null;
  onAnswer: (del: boolean) => void;
  onClose: () => void;
}

export function DeleteConfirmDialog({
  title,
  confirmationText,
  open,
  deletedText,
  onAnswer,
  onClose,
}: DeleteConfirmDialogProps) {
  const handleCloseAndAnswer = React.useCallback(
    (del: boolean) => {
      onAnswer(del);
      onClose();
    },
    [onAnswer, onClose]
  );

  return (
    <Dialog onClose={onClose} open={open} aria-labelledby="edit-dialog-title" maxWidth="md">
      <DialogTitle id="edit-dialog-title">{title}</DialogTitle>
      <IconButton
        aria-label="close"
        color="inherit"
        size="small"
        onClick={() => onClose()}
        sx={{
          position: 'absolute',
          right: 8,
          top: '5%',
        }}
      >
        <Close fontSize="inherit" />
      </IconButton>
      <DialogContent dividers>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography>&quot;{deletedText}&quot;</Typography>
          <Typography>{confirmationText}</Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Button onClick={() => handleCloseAndAnswer(true)} color="error">
              Sim
            </Button>
            <Button onClick={() => handleCloseAndAnswer(false)} color="primary">
              Não
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
