import { Paper } from '@mui/material';
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

export function Question({ text, color, answer, isEditing, type }: QuestionProps) {
  const dropdownAnswers = answer ? answer.split(',') : [];
  return (
    <Paper elevation={4} sx={{ padding: 2, maxWidth: 500, my: 2, bgcolor: color }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
          {text}
        </Typography>
        {!isEditing &&
          (answer === 'yes' ? (
            <CheckCircleIcon sx={{ fontSize: 50 }} />
          ) : answer === 'no' ? (
            <CancelIcon sx={{ fontSize: 50 }} />
          ) : null)}
      </div>
      {type === 'dropdown' && dropdownAnswers.length > 0 && (
        <ul>
          {dropdownAnswers.map((option, index) => (
            <li key={index}>{option}</li>
          ))}
        </ul>
      )}
    </Paper>
  );
}
