import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { Question } from '../../../domain/Form/Form';

export interface AddConditionDialogProps {
  open: boolean;
  questions: Question[];
  onAnswer: (fact: string, type: string, answer: string) => void;
  onClose: () => void;
}

export function AddConditionDialog({ open, questions, onAnswer, onClose }: AddConditionDialogProps) {
  const [questionCondition, setQuestionCondition] = useState<string | null>(null);
  const [conditionAnswer, setConditionAnswer] = useState<string | null>(null);

  const handleCloseAndAnswer = React.useCallback(() => {
    onAnswer(questionCondition, 'equal', conditionAnswer);
    onClose();
  }, [onAnswer, onClose, questionCondition, conditionAnswer]);

  function createQuestionAnswersInput(question?: Question) {
    if (!question) {
      return (
        <>
          <InputLabel id="selecionar-resposta-label">Resposta</InputLabel>
          <Select
            disabled={true}
            labelId="selecionar-resposta-label"
            id="selecionar-resposta-label"
            value=""
            label="Resposta"
          ></Select>
        </>
      );
    }

    switch (question.type) {
      case 'boolean':
        return (
          <>
            <InputLabel id="selecionar-resposta-label">Resposta</InputLabel>
            <Select
              disabled={!questionCondition}
              labelId="selecionar-resposta-label"
              id="selecionar-resposta-label"
              value={conditionAnswer ?? ''}
              label="Resposta"
              onChange={event => {
                setConditionAnswer(event.target.value);
              }}
            >
              <MenuItem value="yes">Sim</MenuItem>
              <MenuItem value="no">Não</MenuItem>
            </Select>
          </>
        );
      case 'text':
        return (
          <>
            <InputLabel id="selecionar-resposta-label">Resposta</InputLabel>
            <TextField
              disabled={!questionCondition}
              id="selecionar-resposta"
              label="Resposta"
              value={conditionAnswer ?? ''}
              onChange={event => setConditionAnswer(event.target.value)}
            />
          </>
        );
      case 'dropdown':
        return (
          <>
            <InputLabel id="selecionar-resposta-label">Resposta</InputLabel>
            <Select
              disabled={!questionCondition}
              labelId="selecionar-resposta-label"
              id="selecionar-resposta-label"
              value={conditionAnswer ?? ''}
              label="Resposta"
              onChange={event => {
                setConditionAnswer(event.target.value);
              }}
            >
              {question.options.map(option => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </>
        );
    }
  }

  return (
    <Dialog onClose={onClose} open={open} aria-labelledby="edit-dialog-title" maxWidth="md" fullWidth>
      <DialogTitle id="edit-dialog-title">Criar Condição</DialogTitle>
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
          <>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 1,
                width: '100%',
              }}
            >
              <FormControl fullWidth margin="normal">
                <InputLabel id="selecionar-questao-label">Questão</InputLabel>
                <Select
                  labelId="selecionar-questao-label"
                  id="selecionar-questao"
                  value={questionCondition ?? ''}
                  label="Questão"
                  onChange={event => {
                    const newValue = event.target.value;
                    setQuestionCondition(newValue);

                    // Ensure conditionAnswer is also valid for the selected question
                    const selectedQuestion = questions.find(q => q.id === newValue);
                    if (selectedQuestion) {
                      setConditionAnswer('');
                    }
                  }}
                  fullWidth
                >
                  {questions?.map(q => (
                    <MenuItem key={q.id} value={q.id}>
                      {q.text}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                {createQuestionAnswersInput(questions?.find(q => q.id === questionCondition))}
              </FormControl>
            </Box>
            <FormControl fullWidth>
              <Button
                disabled={!questionCondition || !conditionAnswer}
                onClick={handleCloseAndAnswer}
                sx={{
                  mt: 1,
                  alignSelf: 'center',
                }}
              >
                Add Condition
              </Button>
            </FormControl>
          </>
          <Button
            onClick={() => {
              handleCloseAndAnswer();
            }}
          >
            Save
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
