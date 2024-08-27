import { Box, Paper } from '@mui/material';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import React from 'react';

type QuestionProps = {
  text: string;
  color: string;
  answer: string | string[] | null;
  type: string;
  isEditing: boolean;
};
export function Question({ text, color, answer, isEditing, type }: QuestionProps) {
  const isAnswerYes = answer === 'yes';
  const isAnswerNo = answer === 'no';

  const formattedAnswer = Array.isArray(answer) ? answer.join(', ') : answer;

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
          {type != 'boolean' && answer && (
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
                Resposta: {formattedAnswer}
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
