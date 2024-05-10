import React from 'react';
import { ListItem, ListItemText } from '@mui/material';
import { Question } from '../../domain/Form/Form';

interface DraggableQuestionProps {
  question: Question;
  groupName: string;
  onDragStart: (event: React.DragEvent) => void;
}

export function DraggableQuestion(props: DraggableQuestionProps) {
  return (
    <ListItem draggable onDragStart={event => props.onDragStart(event)} style={{ cursor: 'grab' }}>
      <ListItemText primary={props.question.text} secondary={props.question.type} />
    </ListItem>
  );
}
