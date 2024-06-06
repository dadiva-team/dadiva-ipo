import { QuestionWithAnswer } from './utils/DoctorSearchAux';
import { Box, Divider, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import React from 'react';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface FormDetailsProps {
  formWithAnswers: QuestionWithAnswer[];
  invalidQuestions?: QuestionWithAnswer[];
}

export function FormDetails({ formWithAnswers, invalidQuestions }: FormDetailsProps) {
  return (
    <Box sx={{ border: 0.5}}>
      {formWithAnswers.map((item, index) => {
        const isInvalid = invalidQuestions?.some(invalid => invalid.id === item.id);
        return (
          <Box
            key={index}
            sx={{
              position: 'relative',
              marginBottom: 1,
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={10}>
                <Box p={2} display="flex" alignItems="center">
                  {isInvalid && <ErrorOutlineIcon color="error" sx={{ marginRight: 1 }} />}
                  <Typography variant="body1">{item.question}</Typography>
                </Box>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body1">{item.answer}</Typography>
              </Grid>
            </Grid>
            {index < formWithAnswers.length - 1 && <Divider />}
          </Box>
        );
      })}
    </Box>
  );
}