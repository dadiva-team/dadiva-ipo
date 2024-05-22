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
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { Question } from '../../../../domain/Form/Form';
import { ErrorAlert } from '../../../shared/ErrorAlert';
import { useDialog } from './useDialog';
import { DropdownOptionsForm } from './DropdownOptionsForm';

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
