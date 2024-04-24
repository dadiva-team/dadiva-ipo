import { Paper } from '@mui/material';
import Typography from '@mui/material/Typography';
import React from 'react';

type QuestionProps = {
  text: string;
  color: string;
};

export function Question({ text, color }: QuestionProps) {
  return (
    <Paper elevation={4} sx={{ padding: 2, maxWidth: 500, my: 2, bgcolor: color }}>
      <Typography variant="body1" component="div" sx={{ marginTop: 1 }}>
        {text}
      </Typography>
    </Paper>
  );
}
