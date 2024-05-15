import React, { useEffect } from 'react';
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Input, MenuItem, Select } from '@mui/material';
//import { getInputComponent } from '../form/utils/GetInputComponent';
import { Close } from '@mui/icons-material';
import { Question } from '../../domain/Form/Form';
import Typography from '@mui/material/Typography';

export interface QuestionEditDialogProps {
  open: boolean;
  question: Question;
  onAnswer: (id: string, text: string, type: string, options: string[] | null) => void;
  onClose: () => void;
}

export function QuestionEditDialog({ open, question, onAnswer, onClose }: QuestionEditDialogProps) {
  /*
  const input = React.useMemo(() => question, [question]);
  */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [questionID, setQuestionID] = React.useState('');
  const [questionText, setQuestionText] = React.useState(question?.text ?? '');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [questionType, setQuestionType] = React.useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [questionOptions, setQuestionOptions] = React.useState<string[]>(null);

  useEffect(() => {
    if (question) {
      setQuestionID(question.id);
      setQuestionText(question.text);
      setQuestionType(question.type);
      setQuestionOptions(question.options);
    }
  }, [question]);

  const handleCloseAndAnswer = React.useCallback(() => {
    onAnswer(questionID, questionText, questionType, questionOptions);
    onClose();
  }, [onAnswer, onClose, questionID, questionOptions, questionText, questionType]);
  return (
    <Dialog onClose={onClose} open={open} aria-labelledby="edit-dialog-title" maxWidth="md" fullWidth>
      <DialogTitle id="edit-dialog-title">Editar a Questão</DialogTitle>
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
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%', // Ensures the input box takes up full width of the parent container
              marginBottom: 2, // Adds some space below the input box
            }}
          >
            <Typography sx={{ marginRight: 1 }}>Texto:</Typography>
            <Input
              value={questionText}
              onChange={event => {
                setQuestionText(event.target.value);
              }}
            />
          </Box>
          <Select
            value={questionType}
            label="Tipo de Resposta"
            onChange={event => {
              setQuestionType(event.target.value);
            }}
          >
            <MenuItem value={'text'}>Texto</MenuItem>
            <MenuItem value={'boolean'}>Sim ou Não</MenuItem>
          </Select>
        </Box>
        <Button
          onClick={() => {
            handleCloseAndAnswer();
          }}
        >
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
}
