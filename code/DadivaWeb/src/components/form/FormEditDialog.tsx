import React from 'react';
import { Box, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { Question } from './Question';
import { getInputComponent } from './utils/GetInputComponent';
import { Close } from '@mui/icons-material';

interface Question {
  id: string;
  type: string;
  text: string;
  options: string[];
}

export interface SimpleDialogProps {
  open: boolean;
  question: Question | null;
  onAnswer: (id: string, type: 'string' | 'boolean' | 'array', answer: string | boolean | string[]) => void;
  onClose: () => void;
}

export function FormEditDialog({ open, question, onAnswer, onClose }: SimpleDialogProps) {
  const handleCloseAndAnswer = React.useCallback(
    (id: string, type: 'string' | 'boolean' | 'array', answer: string | boolean | string[]) => {
      onAnswer(id, type, answer);
      onClose();
    },
    [onAnswer, onClose]
  );

  const input = React.useMemo(
    () => question && getInputComponent(question, handleCloseAndAnswer),
    [question, handleCloseAndAnswer]
  );

  if (!question) return null;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      aria-labelledby="edit-dialog-title"
      sx={{
        '& .MuiPaper-root': {
          backgroundColor: 'white', // Set the dialog background color
        },
      }}
    >
      <DialogTitle id="edit-dialog-title">Edite a sua resposta</DialogTitle>
      <IconButton
        aria-label="close"
        color="inherit"
        size="small"
        onClick={() => handleClose()}
        sx={{
          position: 'absolute',
          right: 8,
          top: '5%',
        }}
      >
        <Close fontSize="inherit" />
      </IconButton>
      <DialogContent
        dividers
        sx={{
          backgroundColor: 'white', // Set the content background color
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Question text={question.text} color={''} answer={null} isEditing={true} />
          <Box sx={{ pt: 1.5, width: '100%' }}>{input}</Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
