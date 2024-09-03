import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  Typography,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { Question } from '../../../domain/Form/Form';
import { createQuestionAnswersInput } from '../editForm/dialogs/shared/CreateQuestionAnswersInput';

export interface EditConditionDialogProps {
  open: boolean;
  questions: Question[];
  condition: { fact: string; value: string }; // The condition to edit
  onAnswer: (fact: string, answer: string) => void;
  onClose: () => void;
}

export function EditConditionDialog({ open, questions, condition, onAnswer, onClose }: EditConditionDialogProps) {
  const [questionCondition, setQuestionCondition] = useState<string | null>(condition?.fact);
  const [conditionAnswer, setConditionAnswer] = useState<string | null>(condition?.value);

  useEffect(() => {
    setQuestionCondition(condition?.fact);
    setConditionAnswer(condition?.value);
  }, [condition]);

  const handleSaveAndClose = React.useCallback(() => {
    onAnswer(questionCondition, conditionAnswer);
    onClose();
  }, [onAnswer, onClose, questionCondition, conditionAnswer]);

  const selectedQuestion = questions.find(q => q.id === questionCondition);

  return (
    <Dialog onClose={onClose} open={open} aria-labelledby="edit-dialog-title" maxWidth="md" fullWidth>
      <DialogTitle id="edit-dialog-title">Editar Condição</DialogTitle>
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
          <Typography variant="h6" gutterBottom>
            {selectedQuestion?.text ?? 'Questão não encontrada'}
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel id="resposta-condicao-label">Resposta</InputLabel>
            {createQuestionAnswersInput({
              question: questions?.find(q => q.id === questionCondition),
              questionCondition,
              conditionAnswer,
              setConditionAnswer,
            })}
          </FormControl>
          <Button
            disabled={!questionCondition || !conditionAnswer}
            onClick={handleSaveAndClose}
            sx={{
              mt: 2,
              alignSelf: 'center',
            }}
          >
            Guardar alterações
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
