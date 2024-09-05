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
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { Question } from '../../../domain/Form/Form';
import { createQuestionAnswersInput } from '../editForm/dialogs/shared/CreateQuestionAnswersInput';
import { useTranslation } from 'react-i18next';

export interface AddConditionDialogProps {
  open: boolean;
  questions: Question[];
  onAnswer: (fact: string, type: string, answer: string) => void;
  onClose: () => void;
}

export function AddConditionDialog({ open, questions, onAnswer, onClose }: AddConditionDialogProps) {
  const { t } = useTranslation();
  const [questionCondition, setQuestionCondition] = useState<string | null>(null);
  const [conditionAnswer, setConditionAnswer] = useState<string | null>(null);

  const handleCloseAndAnswer = React.useCallback(() => {
    onAnswer(questionCondition, 'equal', conditionAnswer);
    onClose();
  }, [onAnswer, onClose, questionCondition, conditionAnswer]);

  return (
    <Dialog onClose={onClose} open={open} aria-labelledby="edit-dialog-title" maxWidth="md" fullWidth>
      <DialogTitle id="edit-dialog-title">{t('Create Condition')}</DialogTitle>
      <IconButton
        aria-label={t('Close')}
        color="inherit"
        size="small"
        onClick={() => onClose()}
        sx={{ position: 'absolute', right: 8, top: '5%' }}
      >
        <Close fontSize="inherit" />
      </IconButton>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1, width: '100%' }}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="select-question-label">{t('Question')}</InputLabel>
                <Select
                  labelId="select-question-label"
                  id="select-question"
                  value={questionCondition ?? ''}
                  label={t('Question')}
                  onChange={event => {
                    const newValue = event.target.value;
                    setQuestionCondition(newValue);

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
                {createQuestionAnswersInput({
                  question: questions?.find(q => q.id === questionCondition),
                  questionCondition,
                  conditionAnswer,
                  setConditionAnswer,
                })}
              </FormControl>
            </Box>
            <FormControl fullWidth>
              <Button
                disabled={!questionCondition || !conditionAnswer}
                onClick={handleCloseAndAnswer}
                sx={{ mt: 1, alignSelf: 'center' }}
              >
                {t('Save')}
              </Button>
            </FormControl>
          </>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
