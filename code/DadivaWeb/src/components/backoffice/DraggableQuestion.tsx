import React from 'react';
import { Box, ListItem } from '@mui/material';
import { Question } from '../../domain/Form/Form';
import Typography from '@mui/material/Typography';
//import EditIcon from '@mui/icons-material/Edit';
import { EditButton } from '../form/Inputs';

interface DraggableQuestionProps {
  question: Question;
  groupName: string;
  onDragStart: (event: React.DragEvent) => void;
  onEditRequest: (question: Question) => void;
}

export function DraggableQuestion(props: DraggableQuestionProps) {
  return (
    <ListItem draggable onDragStart={event => props.onDragStart(event)} style={{ cursor: 'grab' }}>
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
            {props.question.text}
          </Typography>
        </Box>
        <EditButton onChangeAnswer={() => props.onEditRequest(props.question)} enableEdit={true} />
      </Box>
    </ListItem>
  );
}
