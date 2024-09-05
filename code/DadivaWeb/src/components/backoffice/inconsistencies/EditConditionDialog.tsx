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
import { useTranslation } from 'react-i18next'; // Import useTranslation

export interface EditConditionDialogProps {
  open: boolean;
  questions: Question[];
  condition: { fact: string; value: string };
  onAnswer: (fact: string, answer: string) => void;
  onClose: () => void;
}

export function EditConditionDialog({ open, questions, condition, onAnswer, onClose }: EditConditionDialogProps) {
  const { t } = useTranslation();
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
      <DialogTitle id="edit-dialog-title">{t('Edit Condition')}</DialogTitle>
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
          <Typography variant="h6" gutterBottom>
            {selectedQuestion?.text ?? t('Question not found')}
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel id="response-label">{t('Response')}</InputLabel>
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
            sx={{ mt: 2, alignSelf: 'center' }}
          >
            {t('Save Changes')}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
