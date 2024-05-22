import React, { useEffect, useCallback, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from '@mui/material';
import { Close, Delete } from '@mui/icons-material';
import { Question, ShowCondition } from '../../../../domain/Form/Form';
import { ErrorAlert } from '../../../shared/ErrorAlert';
import { useDialog } from './useDialog';
import { DropdownOptionsForm } from './DropdownOptionsForm';

export interface QuestionEditDialogProps {
  open: boolean;
  question: Question;
  questions: Question[];
  onAnswer: (
    id: string,
    text: string,
    type: string,
    options: string[] | null,
    showCondition?: ShowCondition,
    parentQuestionId?: string | null
  ) => void;
  onClose: () => void;
  isFirst: boolean;
}

export function QuestionEditDialog({ open, question, questions, onAnswer, onClose, isFirst }: QuestionEditDialogProps) {
  const {
    questionId,
    setQuestionId,
    questionText,
    setQuestionText,
    questionType,
    setQuestionType,
    questionOptions,
    setQuestionOptions,
    optionInput,
    setOptionInput,
    error,
    setError,
    handleAddOption,
    handleRemoveOption,
    moveOptionUp,
    moveOptionDown,
  } = useDialog();

  const [questionShowConditionType, setQuestionShowConditionType] = useState<'sequential' | 'subordinate'>(
    question?.showCondition ? 'subordinate' : 'sequential'
  );
  const [showCondition, setShowCondition] = useState<ShowCondition>(question?.showCondition ?? { if: {} });
  const [questionCondition, setQuestionCondition] = useState<string | null>(null);
  const [conditionAnswer, setConditionAnswer] = useState<string | null>(null);

  useEffect(() => {
    if (question) {
      setQuestionId(question.id);
      setQuestionText(question.text);
      setQuestionType(question.type);
      setQuestionOptions(question.options ?? []);
      setQuestionShowConditionType(question.showCondition ? 'subordinate' : 'sequential');
      setShowCondition(question.showCondition ?? { if: {} });

      // para tirar um warning
      if (question.showCondition) {
        const validConditionKey = Object.keys(question.showCondition.if)[0];
        setQuestionCondition(validConditionKey);
        setConditionAnswer(question.showCondition.if[validConditionKey]);
      }
    }
  }, [question, setQuestionId, setQuestionOptions, setQuestionText, setQuestionType]);

  const handleCloseAndAnswer = useCallback(() => {
    if (questionText.trim() === '') {
      setError('O texto da pergunta não pode estar vazio');
      return;
    }
    if (questionType === 'dropdown' && (questionOptions == null || questionOptions.length < 2)) {
      setError('Uma pergunta de escolha múltipla deve ter pelo menos duas opções');
      return;
    }

    if (
      questionShowConditionType === 'subordinate' &&
      (questionCondition === null || conditionAnswer === null || conditionAnswer === '')
    ) {
      setError('Uma pergunta subordinada deve ter uma condição');
      return;
    }

    if (questionShowConditionType === 'subordinate' && Object.keys(showCondition.if).length === 0) {
      setError('Não se esqueça de guardar a condição!');
      return;
    }

    onAnswer(
      questionId,
      questionText,
      questionType,
      questionOptions,
      questionShowConditionType === 'subordinate' ? showCondition : undefined,
      questionCondition
    );
    onClose();
  }, [
    questionText,
    questionType,
    questionOptions,
    questionShowConditionType,
    questionCondition,
    conditionAnswer,
    onAnswer,
    questionId,
    showCondition,
    onClose,
    setError,
  ]);

  function handleRemoveCondition(fact: string) {
    setShowCondition(oldShowCondition => {
      const newShowCondition = { ...oldShowCondition };
      delete newShowCondition.if[fact];
      return newShowCondition;
    });
  }

  function handleAddCondition() {
    setShowCondition(oldShowCondition => {
      const newShowCondition = { ...oldShowCondition };
      newShowCondition.if[questionCondition] = conditionAnswer;
      return newShowCondition;
    });
  }

  function translateResponse(response: string) {
    return response === 'yes' ? 'Sim' : response === 'no' ? 'Não' : response;
  }

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
            gap: 2,
          }}
        >
          <FormControl fullWidth>
            <TextField
              id="demo-simple-textfield"
              value={questionText}
              label="Corpo da Pergunta"
              onChange={event => {
                setQuestionText(event.target.value);
              }}
            />
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Tipo de Resposta</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={questionType ?? ''}
              label="Tipo de Resposta"
              onChange={event => {
                setQuestionType(event.target.value);
              }}
            >
              <MenuItem value={'boolean'}>Sim ou Não</MenuItem>
              <MenuItem value={'text'}>Texto</MenuItem>
              <MenuItem value={'dropdown'}>Escolha Múltipla</MenuItem>
            </Select>
          </FormControl>
          {questionType === 'dropdown' && (
            <DropdownOptionsForm
              optionInput={optionInput}
              questionOptions={questionOptions}
              setOptionInput={setOptionInput}
              handleAddOption={handleAddOption}
              handleRemoveOption={handleRemoveOption}
              moveOptionUp={moveOptionUp}
              moveOptionDown={moveOptionDown}
            />
          )}
          <Divider />
          {isFirst && (
            <FormControl fullWidth>
              <InputLabel id="selecionar-condicao-label">Condição</InputLabel>
              <Select
                labelId="selecionar-condicao-label"
                id="selecionar-condicao"
                value={questionShowConditionType ?? ''}
                label="Grupo da Resposta"
                onChange={event => {
                  setQuestionShowConditionType(event.target.value as 'sequential' | 'subordinate');
                }}
              >
                <MenuItem value="sequential">Sequencial</MenuItem>
                <MenuItem value="subordinate">Subordinada</MenuItem>
              </Select>
            </FormControl>
          )}
          {questionShowConditionType === 'subordinate' && (
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
                  onClick={handleAddCondition}
                  sx={{
                    mt: 1,
                    alignSelf: 'center',
                  }}
                >
                  Add Condition
                </Button>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Condições
                </Typography>
                <List>
                  {Object.keys(showCondition?.if).map((fact, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={`${questions?.find(q => q.id === fact)?.text} = ${translateResponse(showCondition.if[fact])}`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveCondition(fact)}>
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </FormControl>
            </>
          )}
          {error && <ErrorAlert error={error} clearError={() => setError(null)} />}
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
