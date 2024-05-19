import React from 'react';
import { Box, Button, ListItem } from '@mui/material';
import { Question } from '../../domain/Form/Form';
import Typography from '@mui/material/Typography';
import { EditButton } from '../form/Inputs';
import DeleteIcon from '@mui/icons-material/Delete';

interface DraggableQuestionProps {
  question: Question;
  groupName: string;
  index: number;
  onDragStart: (event: React.DragEvent) => void;
  onEditRequest: (question: Question) => void;
  onDeleteRequest: (question: Question) => void;
}

export function DraggableQuestion(props: DraggableQuestionProps) {
  return (
    <ListItem
      draggable
      onDragStart={event => {
        event.dataTransfer.setData('questionID', props.question.id);
        event.dataTransfer.setData('questionIndex', props.index.toString());
        props.onDragStart(event);
      }}
      style={{ cursor: 'grab' }}
      sx={{
        bgcolor: '#ffffff',
        '&:hover': {
          bgcolor: '#aaaaaa',
        },
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          mt: 1,
          '@media (max-width: 600px)': {
            flexDirection: 'column',
          },
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
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            gap: 1,
            '@media (max-width: 600px)': {
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
            },
          }}
        >
          <EditButton onChangeAnswer={() => props.onEditRequest(props.question)} enableEdit={true} />
          <Button
            color="warning"
            variant="outlined"
            onClick={() => props.onDeleteRequest(props.question)}
            startIcon={<DeleteIcon />}
            sx={{ borderRadius: 50, height: 40 }}
          >
            Apagar
          </Button>
        </Box>
      </Box>
    </ListItem>
  );
}
