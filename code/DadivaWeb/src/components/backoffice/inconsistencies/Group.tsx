import React from 'react';
import { Box, Card, Divider, List, Typography } from '@mui/material';
import { Question as QuestionModel } from '../../../domain/Form/Form';
import { Question } from './Question';

interface GroupProps {
  group: { name: string; questions: QuestionModel[] };
}

export function Group(props: GroupProps) {
  const renderQuestions = (questions: QuestionModel[], parentQuestionId: string | null = null) => {
    const questionList = questions.filter(q =>
      parentQuestionId ? q.showCondition?.if?.[parentQuestionId] : !q.showCondition
    );

    return questionList.map((question, index) => (
      <React.Fragment key={question.id}>
        <Question
          question={question}
          subordinateQuestions={questions.filter(q => q.showCondition?.if?.[question.id])}
        />
        {index !== questionList.length - 1 && <Divider />}
      </React.Fragment>
    ));
  };

  return (
    <Card
      sx={{
        margin: 2,
        border: 1.5,
        borderColor: 'black',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 2,
        }}
      >
        <Typography variant="h6">{props.group.name}</Typography>
      </Box>
      <Divider sx={{ borderColor: 'black', borderWidth: 1 }} />
      <List>{renderQuestions(props.group.questions)}</List>
    </Card>
  );
}
