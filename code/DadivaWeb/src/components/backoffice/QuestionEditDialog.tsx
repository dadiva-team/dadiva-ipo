import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
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
import { Question } from '../../domain/Form/Form';
import Typography from '@mui/material/Typography';

export interface QuestionEditDialogProps {
  open: boolean;
  question: Question;
  onAnswer: (id: string, text: string, type: string, options: string[] | null) => void;
  onClose: () => void;
}

export function QuestionEditDialog({ open, question, onAnswer, onClose }: QuestionEditDialogProps) {
  const [questionText, setQuestionText] = React.useState(question?.text ?? '');
  const [questionType, setQuestionType] = React.useState('');
  const [questionOptions, setQuestionOptions] = React.useState<string[]>(null);
  const [optionInput, setOptionInput] = React.useState('');

  useEffect(() => {
    if (question) {
      setQuestionText(question.text);
      setQuestionType(question.type);
      setQuestionOptions(question.options);
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
    onAnswer(question.id, questionText, questionType, questionOptions);
    onClose();
  }, [onAnswer, onClose, question, questionOptions, questionText, questionType]);
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
