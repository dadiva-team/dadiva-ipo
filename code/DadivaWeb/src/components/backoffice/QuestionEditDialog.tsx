import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { ArrowDownward, ArrowUpward, Close, Delete } from '@mui/icons-material';
import { Question, ShowCondition } from '../../domain/Form/Form';
import Typography from '@mui/material/Typography';

export interface QuestionEditDialogProps {
  open: boolean;
  question: Question;
  questions: Question[];
  onAnswer: (id: string, text: string, type: string, options: string[] | null, showCondition?: ShowCondition) => void;
  onClose: () => void;
  isFirst: boolean;
}

export function QuestionEditDialog({ open, question, questions, onAnswer, onClose, isFirst }: QuestionEditDialogProps) {
  const [questionText, setQuestionText] = React.useState(question?.text ?? '');
  const [questionType, setQuestionType] = React.useState('');
  const [questionOptions, setQuestionOptions] = React.useState<string[]>(null);
  const [optionInput, setOptionInput] = React.useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [questionShowConditionType, setQuestionShowConditionType] = React.useState<'sequential' | 'subordinate'>(
    'sequential'
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showCondition, setShowCondition] = React.useState<ShowCondition>({ if: {} });
  const [questionCondition, setQuestionCondition] = React.useState<string>(null);
  const [conditionAnswer, setConditionAnswer] = React.useState<string>(null);

  useEffect(() => {
    if (question) {
      setQuestionText(question.text);
      setQuestionType(question.type);
      setQuestionOptions(question.options);
      setQuestionShowConditionType(question.showCondition ? 'subordinate' : 'sequential');
    }
  }, [question]);

  const handleAddOption = () => {
    if (optionInput.trim() !== '') {
      setQuestionOptions(oldOptions => [...(oldOptions ?? []), optionInput.trim()]);
      setOptionInput('');
    }
  };

  const handleRemoveOption = (index: number) => {
    setQuestionOptions(oldOptions => oldOptions.filter((_, i) => i !== index));
  };

  const moveOptionUp = (index: number) => {
    if (index > 0) {
      setQuestionOptions(oldOptions => {
        const newOptions = [...oldOptions];
        const temp = newOptions[index];
        newOptions[index] = newOptions[index - 1];
        newOptions[index - 1] = temp;
        return newOptions;
      });
    }
  };

  const moveOptionDown = (index: number) => {
    if (index < questionOptions.length - 1) {
      const newOptions = [...questionOptions];
      const temp = newOptions[index];
      newOptions[index] = newOptions[index + 1];
      newOptions[index + 1] = temp;
      setQuestionOptions(newOptions);
    }
  };

  const handleCloseAndAnswer = React.useCallback(() => {
    onAnswer(
      question.id,
      questionText,
      questionType,
      questionOptions,
      questionShowConditionType === 'subordinate' ? showCondition : null
    );
    onClose();
  }, [
    onAnswer,
    onClose,
    question,
    questionOptions,
    questionShowConditionType,
    questionText,
    questionType,
    showCondition,
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

  function createQuestionAnswersInput(question: Question) {
    if (!question)
      return (
        <>
          <InputLabel id="selecionar-resposta-label">Resposta</InputLabel>
          <Select
            disabled={true}
            labelId="selecionar-resposta-label"
            id="selecionar-resposta-label"
            label="Resposta"
          ></Select>
        </>
      );

    switch (question.type) {
      case 'boolean':
        return (
          <>
            <InputLabel id="selecionar-resposta-label">Resposta</InputLabel>
            <Select
              disabled={!questionCondition}
              labelId="selecionar-resposta-label"
              id="selecionar-resposta-label"
              value={conditionAnswer}
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
              value={conditionAnswer}
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
              value={conditionAnswer}
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
              value={questionType}
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
            <FormControl fullWidth margin="normal">
              <TextField
                id="option-input"
                value={optionInput}
                label="Adicionar Opção"
                onChange={event => setOptionInput(event.target.value)}
                fullWidth
              />
              <Button
                onClick={handleAddOption}
                sx={{
                  mt: 1,
                  alignSelf: 'center',
                }}
              >
                Add Option
              </Button>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Escolhas Possíveis
              </Typography>
              <List>
                {questionOptions?.map((option, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={option} />
                    <ListItemSecondaryAction>
                      <IconButton disabled={index === 0} edge="end" aria-label="up" onClick={() => moveOptionUp(index)}>
                        <ArrowUpward />
                      </IconButton>
                      <IconButton
                        disabled={index === questionOptions.length - 1}
                        edge="end"
                        aria-label="down"
                        onClick={() => moveOptionDown(index)}
                      >
                        <ArrowDownward />
                      </IconButton>
                      <IconButton
                        disabled={questionOptions.length === 1}
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleRemoveOption(index)}
                      >
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </FormControl>
          )}
          <Divider />
          {isFirst && (
            <FormControl fullWidth>
              <InputLabel id="selecionar-condicao-label">Condição</InputLabel>
              <Select
                labelId="selecionar-condicao-label"
                id="selecionar-condicao"
                value={questionShowConditionType}
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
                    value={questionCondition}
                    label="Questão"
                    onChange={event => {
                      setQuestionCondition(event.target.value);
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
                  {createQuestionAnswersInput(questions?.find(q => q.id == questionCondition))}
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
                  Add Option
                </Button>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Condições
                </Typography>
                <List>
                  {Object.keys(showCondition?.if).map((fact, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={`${questions?.find(q => q.id === fact).text} = ${translateResponse(showCondition.if[fact])}`}
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
