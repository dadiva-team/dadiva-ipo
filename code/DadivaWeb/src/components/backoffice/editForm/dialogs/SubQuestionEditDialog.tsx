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
  ListItemText,
} from '@mui/material';
import { Close, Delete, Edit } from '@mui/icons-material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PushPinIcon from '@mui/icons-material/PushPin';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import { Question, ShowCondition } from '../../../../domain/Form/Form';
import { ErrorAlert } from '../../../shared/ErrorAlert';
import { useDialog } from './useDialog';
import { DropdownOptionsForm } from './DropdownOptionsForm';
import { PendingActionAlert } from '../../../shared/PendingActionAlert';
import { createQuestionAnswersInput } from './shared/CreateQuestionAnswersInput';

export interface SubQuestionEditDialogProps {
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
  onDeleteSubQuestion: (question: Question, isSubQuestion: boolean, parentQuestionId: string | null) => void;
  onRemoveCondition: (parentQuestionId: string, subQuestionId: string) => void;
  onClose: () => void;
}

export function SubQuestionEditDialog({
  open,
  question,
  questions,
  onAnswer,
  onDeleteSubQuestion,
  onRemoveCondition,
  onClose,
}: SubQuestionEditDialogProps) {
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

  const [showCondition, setShowCondition] = useState<ShowCondition>(question?.showCondition ?? { if: {} });
  const [questionCondition, setQuestionCondition] = useState<string | null>(null);
  const [conditionAnswer, setConditionAnswer] = useState<string | null>(null);

  const [newConditionQuestion, setNewConditionQuestion] = useState<string | null>(null);
  const [isAddingCondition, setIsAddingCondition] = useState<boolean>(false);

  const [editingConditionKey, setEditingConditionKey] = useState<string | null>(null);
  const [intendedAction, setIntendedAction] = useState<'remove' | 'return' | 'condition'>(null);
  const [conditionToDelete, setConditionToDelete] = useState<string>(null);
  const [alert, setAlert] = useState<string | null>(null);

  useEffect(() => {
    if (question) {
      setQuestionId(question.id);
      setQuestionText(question.text);
      setQuestionType(question.type);
      setQuestionOptions(question.options ?? []);
      setShowCondition(question.showCondition ?? { if: {} });

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
    if (questionCondition && !questions.find(q => q.id === questionCondition)) {
      setError('A pergunta de ativação não existe');
      return;
    }
    if (editingConditionKey) {
      setError('Termine de editar a condição de ativação');
      return;
    }

    if (intendedAction === 'remove') {
      onDeleteSubQuestion(question, false, null);
      setIntendedAction(null);
      setConditionToDelete(null);
      setAlert(null);
      onClose();
    } else if (intendedAction === 'return') {
      onDeleteSubQuestion(question, true, questions?.find(q => q.id === questionCondition)?.id);
      setIntendedAction(null);
      setConditionToDelete(null);
      setAlert(null);
      onClose();
    } else if (intendedAction === 'condition') {
      onRemoveCondition(conditionToDelete, question.id);
      setIntendedAction(null);
      setConditionToDelete(null);
      setAlert(null);
      onClose();
    } else {
      onAnswer(questionId, questionText, questionType, questionOptions, showCondition, questionCondition);
      onClose();
    }
  }, [
    questionText,
    questionType,
    questionOptions,
    questionCondition,
    questions,
    editingConditionKey,
    intendedAction,
    setError,
    onDeleteSubQuestion,
    question,
    onClose,
    onRemoveCondition,
    conditionToDelete,
    onAnswer,
    questionId,
    showCondition,
  ]);

  function handleChangeCondition() {
    setShowCondition(oldShowCondition => {
      const newShowCondition = { ...oldShowCondition };
      newShowCondition.if[questionCondition] = conditionAnswer;
      return newShowCondition;
    });
  }

  function translateResponse(response: string) {
    return response === 'yes' ? 'Sim' : response === 'no' ? 'Não' : response;
  }

  function handleAddNewCondition() {
    console.log('handleAddNewCondition');
    console.log(newConditionQuestion, conditionAnswer);
    console.log(showCondition);
    if (newConditionQuestion && conditionAnswer) {
      setShowCondition(oldShowCondition => {
        const newShowCondition = { ...oldShowCondition };
        newShowCondition.if[newConditionQuestion] = conditionAnswer;
        return newShowCondition;
      });
      setNewConditionQuestion(null);
      setConditionAnswer(null);
      setIsAddingCondition(false);
    } else {
      setError('Por favor, selecione uma pergunta e uma resposta para a nova condição.');
    }
  }

  return (
    <Dialog onClose={onClose} open={open} aria-labelledby="edit-dialog-title" maxWidth="md" fullWidth>
      <DialogTitle id="edit-dialog-title">Editar a Questão Subordinada</DialogTitle>
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
              <MenuItem value={'countries'}>Países</MenuItem>
              <MenuItem value={'medications'}>Medicamentos</MenuItem>
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
          <Box>
            <Button
              onClick={() => {
                setIntendedAction('remove');
                setAlert('Tem a certeza que deseja remover esta pergunta?');
              }}
            >
              Remover pergunta
            </Button>
            <Button
              onClick={() => {
                setIntendedAction('return');
                setAlert('Tem a certeza que deseja devolver esta pergunta à pool?');
              }}
            >
              Devolver pergunta à pool
            </Button>
          </Box>

          <Divider />
          {(intendedAction === null || intendedAction === 'condition') && (
            <FormControl fullWidth>
              <>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}
                >
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    Condições que ativam a pergunta
                  </Typography>
                  <IconButton
                    aria-label="add-condition"
                    color="primary"
                    onClick={() => setIsAddingCondition(() => !isAddingCondition)}
                  >
                    {isAddingCondition ? <CancelPresentationIcon /> : <AddCircleOutlineIcon />}
                  </IconButton>
                </Box>
                {isAddingCondition &&
                  questions?.filter(
                    q => q.id !== questionId && !q.showCondition && !Object.keys(showCondition.if).includes(q.id)
                  ).length > 0 && (
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
                        <InputLabel id="new-condition-question-label">Questão</InputLabel>
                        <Select
                          labelId="new-condition-question-label"
                          id="new-condition-question"
                          value={newConditionQuestion ?? ''}
                          label="Questão"
                          onChange={event => {
                            const newValue = event.target.value;
                            setNewConditionQuestion(newValue);
                            setConditionAnswer('');
                          }}
                          fullWidth
                        >
                          {questions
                            ?.filter(
                              q =>
                                q.id !== questionId && !q.showCondition && !Object.keys(showCondition.if).includes(q.id)
                            )
                            .map(q => (
                              <MenuItem key={q.id} value={q.id}>
                                {q.text}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                      <FormControl fullWidth margin="normal">
                        {createQuestionAnswersInput({
                          question: questions?.find(q => q.id === newConditionQuestion),
                          questionCondition,
                          conditionAnswer,
                          setConditionAnswer,
                        })}
                      </FormControl>
                      <IconButton
                        aria-label="add"
                        color="primary"
                        onClick={handleAddNewCondition}
                        disabled={!newConditionQuestion || !conditionAnswer}
                      >
                        <PushPinIcon />
                      </IconButton>
                    </Box>
                  )}
              </>

              <List>
                {Object.keys(showCondition?.if).map((fact, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      sx={{
                        width: '70%',
                        textDecoration: conditionToDelete === fact ? 'line-through' : 'none',
                      }}
                      primary={`${questions?.find(q => q.id === fact)?.text} = ${translateResponse(showCondition.if[fact])}`}
                    />

                    {editingConditionKey === fact ? (
                      <Box flexDirection="column" sx={{ width: '25%' }}>
                        <FormControl fullWidth margin="normal" sx={{ width: '100%' }}>
                          {createQuestionAnswersInput({
                            question: questions?.find(q => q.id === questionCondition),
                            questionCondition,
                            conditionAnswer,
                            setConditionAnswer,
                          })}
                        </FormControl>
                        <Button
                          disabled={!questionCondition || !conditionAnswer}
                          onClick={() => {
                            handleChangeCondition();
                            setEditingConditionKey(null);
                          }}
                        >
                          Guardar
                        </Button>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          width: '25%',
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'flex-end',
                        }}
                      >
                        <IconButton
                          aria-label="edit"
                          disabled={conditionToDelete !== null}
                          onClick={() => {
                            setEditingConditionKey(fact);
                            setQuestionCondition(fact);
                            setConditionAnswer(showCondition.if[fact]);
                          }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          onClick={() => {
                            setIntendedAction('condition');
                            setConditionToDelete(fact);
                            setAlert(
                              `Esta condição será apagada ao guardar: ${questions?.find(q => q.id === fact)?.text}`
                            );
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    )}
                  </ListItem>
                ))}
              </List>
            </FormControl>
          )}
          {error && <ErrorAlert error={error} clearError={() => setError(null)} />}
          {alert && (
            <PendingActionAlert
              actionMessage={alert}
              clearActionMessage={() => {
                setAlert(null);
                setIntendedAction(null);
                setConditionToDelete(null);
              }}
            />
          )}

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
