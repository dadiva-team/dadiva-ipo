import { Box, Paper } from '@mui/material';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import React from 'react';

type QuestionProps = {
  text: string;
  color: string;
  answer: string | null;
  type: string;
  isEditing: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Question({ text, color, answer, isEditing, type }: QuestionProps) {
  //const dropdownAnswers = answer ? answer.split(',') : [];
  return (
    <Paper
      elevation={2}
      sx={{
        width: '550px',
        height: '75px',
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
        <Typography variant="h6">{text}</Typography>

        {!isEditing &&
          (answer === 'yes' ? (
            <CheckCircleIcon sx={{ fontSize: 40 }} />
          ) : answer === 'no' ? (
            <CancelIcon sx={{ fontSize: 40 }} />
          ) : null)}
        {/*type === 'dropdown' && dropdownAnswers.length > 0 && (
          <ul>
            {dropdownAnswers.map((option, index) => (
              <li key={index}>{option}</li>
            ))}
          </ul>
        )*/}
      </Box>
    </Paper>
  );
}
