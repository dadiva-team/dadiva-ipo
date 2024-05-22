import React from 'react';
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
import { Question } from '../../../../domain/Form/Form';
import Typography from '@mui/material/Typography';
import { ErrorAlert } from '../../../shared/ErrorAlert';
import { useDialog } from './useDialog';

export interface QuestionAddDialogProps {
  open: boolean;
  groups: string[];
  onAnswer: (question: Question, groupName: string) => void;
  onClose: () => void;
}

export function QuestionAddDialog({ open, groups, onAnswer, onClose }: QuestionAddDialogProps) {
  const {
    questionText,
    setQuestionText,
    questionType,
    setQuestionType,
    questionOptions,
    optionInput,
    setOptionInput,
    error,
    setError,
    handleAddOption,
    handleRemoveOption,
    moveOptionUp,
    moveOptionDown,
  } = useDialog();

  const [questionGroup, setQuestionGroup] = React.useState(groups[0]);

  const handleCloseAndAnswer = React.useCallback(() => {
    if (questionText.trim() === '') {
      setError('O texto da pergunta não pode estar vazio');
      return;
    }
    if (questionType === 'dropdown' && (questionOptions == null || questionOptions.length < 2)) {
      setError('Uma pergunta de escolha múltipla deve ter pelo menos duas opções');
      return;
    }

    onAnswer(
      {
        id: crypto.randomUUID(),
        text: questionText,
        type: questionType,
        options: questionOptions,
      },
      questionGroup
    );
    onClose();
  }, [questionText, questionType, questionOptions, onAnswer, questionGroup, onClose, setError]);

  return (
    <Dialog onClose={onClose} open={open} aria-labelledby="edit-dialog-title" maxWidth="md" fullWidth>
      <DialogTitle id="edit-dialog-title">Adicionar uma Questão</DialogTitle>
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
            <InputLabel id="selecionar-grupo-label">Grupo da Resposta</InputLabel>
            <Select
              labelId="selecionar-grupo-label"
              disabled={groups.length === 1}
              id="selecionar-grupo"
              value={questionGroup}
              label="Grupo da Resposta"
              onChange={event => {
                setQuestionGroup(event.target.value);
              }}
            >
              {groups.map(group => (
                <MenuItem key={group} value={group}>
                  {group}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <TextField
              id="demo-simple-textfield"
              value={questionText}
              required
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
                      <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveOption(index)}>
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </FormControl>
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