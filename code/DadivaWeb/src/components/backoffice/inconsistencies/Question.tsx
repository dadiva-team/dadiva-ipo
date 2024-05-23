import React from 'react';
import { Box, ListItem, List, Typography } from '@mui/material';
import { Question as QuestionModel } from '../../../domain/Form/Form';

interface QuestionProps {
  question: QuestionModel;
  subordinateQuestions: QuestionModel[];
}

export function Question(props: QuestionProps) {
  return (
    <ListItem>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          mt: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            {props.question.text}
          </Typography>
        </Box>
        {props.subordinateQuestions.length > 0 && (
          <List>
            {props.subordinateQuestions.map(subQuestion => (
              <ListItem key={subQuestion.id}>
                <Typography variant="subtitle1">{subQuestion.text}</Typography>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </ListItem>
  );
}
