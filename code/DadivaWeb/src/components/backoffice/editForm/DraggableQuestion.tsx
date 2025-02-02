import React, { useState } from 'react';
import { Box, Button, List, ListItem, Typography } from '@mui/material';
import { Question } from '../../../domain/Form/Form';
import { EditButton } from '../../form/Inputs';
import DeleteIcon from '@mui/icons-material/Delete';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import { ErrorAlert } from '../../shared/ErrorAlert';
import { useTranslation } from 'react-i18next';

interface DraggableQuestionProps {
  question: Question;
  parentQuestions: Question[];
  groupName: string;
  index: number;
  onDragStart: (event: React.DragEvent) => void;
  onEditRequest: (question: Question) => void;
  onSubEditRequest: (question: Question) => void;
  onDeleteRequest: (question: Question, isSubQuestion: boolean, parentQuestionId: string | null) => void;
  onDragError: string | null;
  onDragErrorClear: () => void;
}

export function DraggableQuestion(props: DraggableQuestionProps) {
  const { t } = useTranslation();
  const [isListVisible, setIsListVisible] = useState(false);
  const isSubquestion = props.parentQuestions.length > 0;
  return (
    <ListItem
      key={props.question.id}
      draggable={!isSubquestion}
      onDragStart={event => {
        event.dataTransfer.setData('questionID', props.question.id);
        event.dataTransfer.setData('questionIndex', props.index.toString());
        props.onDragStart(event);
      }}
      style={{ cursor: !isSubquestion ? 'grab' : 'auto' }}
      sx={{
        bgcolor: '#ffffff',
        '&:hover': {
          bgcolor: !isSubquestion ? '#aaaaaa' : '#ffffff',
        },
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          mt: 1,
        }}
      >
        {isSubquestion && (
          <Button
            variant="outlined"
            sx={{
              width: '20%',
              color: 'white',
              bgcolor: 'red',
            }}
          >
            {t('Subquestion')}
          </Button>
        )}
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
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              gap: 1,
            }}
          >
            <EditButton
              onChangeAnswer={() =>
                isSubquestion ? props.onSubEditRequest(props.question) : props.onEditRequest(props.question)
              }
              enableEdit={true}
            />
            <Button
              color="warning"
              variant="outlined"
              onClick={() => props.onDeleteRequest(props.question, false, null)}
              startIcon={<DeleteIcon />}
              sx={{ borderRadius: 50, height: 40 }}
            >
              {t('Delete')}
            </Button>
          </Box>
        </Box>
        {props.onDragError && <ErrorAlert error={props.onDragError} clearError={() => props.onDragErrorClear()} />}
        {isSubquestion && (
          <>
            <Box sx={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <Button
                size="small"
                variant={isListVisible ? 'text' : 'outlined'}
                onClick={() => setIsListVisible(!isListVisible)}
                endIcon={isListVisible ? <PlaylistRemoveIcon /> : <PlaylistPlayIcon />}
              ></Button>
            </Box>
            {isListVisible && (
              <>
                <List>
                  {props.parentQuestions.map(parentQuestion => (
                    <ListItem key={parentQuestion.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle1">{parentQuestion.text}</Typography>
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </>
        )}
      </Box>
    </ListItem>
  );
}
