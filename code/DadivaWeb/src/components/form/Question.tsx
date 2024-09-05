import { Box, Paper } from '@mui/material';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import React from 'react';
import { Answer, EMPTY_ANSWER } from './utils/formUtils';
import { useTranslation } from 'react-i18next';

type QuestionProps = {
  text: string;
  color: string;
  answer: Answer;
  isEditing: boolean;
};

export function Question({ text, color, answer, isEditing }: QuestionProps) {
  const { t } = useTranslation();
  const isAnswerYes = answer?.type === 'boolean' && answer.value === true;
  const isAnswerNo = answer?.type === 'boolean' && answer.value === false;

  // Format the answer depending on its type
  const formattedAnswer = answer?.type === 'array' ? (answer?.value as string[]).join(', ') : (answer?.value as string);

  return (
    <Paper
      elevation={2}
      sx={{
        width: '90%',
        height: '300%',
        justifyContent: 'left',
        bgcolor: color,
        p: 1,
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          mt: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            {text}
          </Typography>
          {answer?.type !== 'boolean' && answer?.value != EMPTY_ANSWER.value && !isEditing && (
            <Box
              sx={{
                justifyContent: 'left',
                border: 2,
                borderColor: 'darkgreen',
                borderRadius: 1,
                bgcolor: 'grey.200',
                p: 1,
              }}
            >
              <Typography
                variant="body1"
                sx={{ maxWidth: '100%', whiteSpace: 'pre-wrap', overflowWrap: 'break-word', wordBreak: 'break-all' }}
              >
                {t('ResponseForm')}: {formattedAnswer}
              </Typography>
            </Box>
          )}
        </Box>
        {!isEditing && isAnswerYes ? (
          <CheckCircleIcon sx={{ fontSize: 40 }} />
        ) : !isEditing && isAnswerNo ? (
          <CancelIcon sx={{ fontSize: 40 }} />
        ) : null}
      </Box>
    </Paper>
  );
}
