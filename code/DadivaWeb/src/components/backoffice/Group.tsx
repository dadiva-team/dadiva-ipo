import React from 'react';
import { Card, List, Typography } from '@mui/material';
import { Question } from '../../domain/Form/Form';
import { DraggableQuestion } from './DraggableQuestion';

interface GroupProps {
  group: { name: string; questions: Question[] };
  onDrop: (questionID: string, groupName: string, index: number) => void;
  onEditRequest: (question: Question) => void;
}

export function Group(props: GroupProps) {
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault(); // Necessary to allow the drop
  };

  const handleDrop = (event: React.DragEvent) => {
    const questionID = event.dataTransfer.getData('questionID');
    const dropPosition = event.clientY;
    const questionIndex = Array.from(event.currentTarget.children).findIndex(child => {
      const rect = (child as HTMLElement).getBoundingClientRect();
      return dropPosition < rect.bottom;
    });
    props.onDrop(questionID, props.group.name, questionIndex === -1 ? props.group.questions.length : questionIndex);
  };

  return (
    <Card sx={{ margin: 2 }}>
      <Typography variant="h6" sx={{ padding: 2 }}>
        {props.group.name}
      </Typography>
      <List onDragOver={handleDragOver} onDrop={handleDrop}>
        {props.group.questions.map((question, index) => (
          <DraggableQuestion
            key={question.id}
            question={question}
            groupName={props.group.name}
            index={index}
            onDragStart={event => {
              event.dataTransfer.setData('questionID', question.id);
              event.dataTransfer.setData('questionIndex', index.toString());
            }}
            onEditRequest={props.onEditRequest}
          />
        ))}
      </List>
    </Card>
  );
}
