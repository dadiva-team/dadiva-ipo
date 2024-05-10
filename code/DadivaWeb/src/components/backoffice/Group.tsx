import React from 'react';
import { Card, List, Typography } from '@mui/material';
import { Question } from '../../domain/Form/Form';
import { DraggableQuestion } from './DraggableQuestion';

interface GroupProps {
  group: { name: string; questions: Question[] };
  onDrop: (questionID: string, groupName: string) => void;
}

export function Group(props: GroupProps) {
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault(); // Necessary to allow the drop
  };

  const handleDrop = (event: React.DragEvent) => {
    const questionID = event.dataTransfer.getData('questionID');
    props.onDrop(questionID, props.group.name);
  };

  console.log(props.group.questions);

  return (
    <Card sx={{ margin: 2 }}>
      <Typography variant="h6" sx={{ padding: 2 }}>
        {props.group.name}
      </Typography>
      <List onDragOver={handleDragOver} onDrop={handleDrop}>
        {props.group.questions.map(question => (
          <DraggableQuestion
            key={question.id}
            question={question}
            groupName={props.group.name}
            onDragStart={event => {
              event.dataTransfer.setData('questionID', question.id);
            }}
          />
        ))}
      </List>
    </Card>
  );
}
