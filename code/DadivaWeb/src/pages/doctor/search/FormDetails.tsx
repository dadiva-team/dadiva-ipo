import { QuestionWithAnswer } from './utils/DoctorSearchAux';
import { Box, Button, Divider, FormControl, Grid, IconButton, TextField } from '@mui/material';
import Typography from '@mui/material/Typography';
import React, { useState } from "react";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { Close } from '@mui/icons-material';

interface FormDetailsProps {
  formWithAnswers: QuestionWithAnswer[];
  invalidQuestions?: QuestionWithAnswer[];
}

export function FormDetails({ formWithAnswers, invalidQuestions }: FormDetailsProps) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ border: 0.5 }}>
      {formWithAnswers.map((item, index) => {
        const isInvalid = invalidQuestions?.some(invalid => invalid.id === item.id);
        return (
          <Box
            key={index}
            sx={{
              position: 'relative',
              marginBottom: 1,
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={isInvalid ? 9 : 10}>
                <Box p={2} display="flex" alignItems="center">
                  {isInvalid && <ErrorOutlineIcon color="error" sx={{ marginRight: 1 }} />}
                  <Typography variant="body1">{item.question}</Typography>
                </Box>
              </Grid>
              {isInvalid && (
                <Grid item xs={1}>
                  <Box display="flex" alignItems="center">
                    <IconButton onClick={handleClickOpen}>
                      <NoteAddIcon />
                    </IconButton>
                  </Box>
                </Grid>
              )}
              <Grid item xs={2}>
                <Typography variant="body1">{item.answer}</Typography>
              </Grid>
            </Grid>
            {index < formWithAnswers.length - 1 && <Divider />}
          </Box>
        );
      })}
      <NoteDialog
        note={null}
        open={open}
        onAnswer={() => console.log('onAnswer')}
        onClose={() => handleClose()}
      />
    </Box>
  );
}

interface NoteDialogProps {
  open: boolean;
  note?: string;
  onAnswer: (note: string) => void;
  onClose: () => void;
}

export function NoteDialog({ open, note, onAnswer, onClose }: NoteDialogProps) {
  const [noteText, setNoteText] = React.useState(note ?? '');

  const handleCloseAndAnswer = React.useCallback(() => {
    onAnswer(noteText);
    onClose();
  }, [noteText, onAnswer, onClose]);

  return (
    <Dialog onClose={onClose} open={open} aria-labelledby="edit-dialog-title" maxWidth="md" fullWidth>
      <DialogTitle id="edit-dialog-title">Adicionar Nota</DialogTitle>
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
          <FormControl fullWidth>
            <TextField
              id="demo-simple-textfield"
              value={noteText}
              label="Nota"
              onChange={event => {
                setNoteText(event.target.value);
              }}
            />
          </FormControl>
          <Box display="flex" justifyContent="space-between" width="70%">
            <Button
              onClick={() => {
                handleCloseAndAnswer();
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                handleCloseAndAnswer();
              }}
            >
              Guardar Nota
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
