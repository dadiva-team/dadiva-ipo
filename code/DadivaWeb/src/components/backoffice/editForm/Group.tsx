import React from 'react';
import { Box, Card, Divider, IconButton, List, Typography } from '@mui/material';
import { Question } from '../../../domain/Form/Form';
import { DraggableQuestion } from './DraggableQuestion';
import { ArrowDownward, ArrowUpward, Delete, Edit } from '@mui/icons-material';
import ControlPointIcon from '@mui/icons-material/ControlPoint';

interface GroupProps {
  group: { name: string; questions: Question[] };
  onDrop: (questionID: string, groupName: string, index: number) => void;
  onAddQuestion: () => void;
  onEditRequest: (question: Question) => void;
  onSubEditRequest: (question: Question) => void;
  onDeleteRequest: (question: Question, isSubQuestion: boolean, parentQuestionId: string | null) => void;
  onMoveUp: () => void | null;
  onMoveDown: () => void;
  onDropError: { id: string; msg: string } | null;
  onDropErrorClear: () => void;
  onRename: () => void;
  onDelete: () => void;
}

export function Group(props: GroupProps) {
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault(); // Necessary to allow the drop
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const questionID = event.dataTransfer.getData('questionID');
    const dropPosition = event.clientY;
    console.log(event.currentTarget.children);
    const questionIndex = Array.from(event.currentTarget.children).findIndex(child => {
      const rect = (child as HTMLElement).getBoundingClientRect();
      return dropPosition < rect.bottom;
    });
    props.onDrop(questionID, props.group.name, questionIndex === -1 ? props.group.questions.length : questionIndex / 2);
  };

  const renderQuestions = (questions: Question[]) => {
    return questions.map((question, index) => {
      const parentQuestions = question.showCondition?.if ? Object.keys(question.showCondition.if) : [];
      const parentQuestionObjects = parentQuestions
        .map(id => {
          return props.group.questions.find(question => question.id === id);
        })
        .filter(Boolean);

      return (
        <React.Fragment key={question.id}>
          <DraggableQuestion
            question={question}
            parentQuestions={parentQuestionObjects}
            groupName={props.group.name}
            index={index}
            onDragStart={event => {
              event.dataTransfer.setData('questionID', question.id);
              event.dataTransfer.setData('questionIndex', index.toString());
            }}
            onEditRequest={() => props.onEditRequest(question)}
            onDeleteRequest={props.onDeleteRequest}
            onSubEditRequest={props.onSubEditRequest}
            onDragError={props?.onDropError?.id === question.id ? props?.onDropError?.msg : null}
            onDragErrorClear={() => {
              props.onDropErrorClear();
            }}
          />
          <Divider />
        </React.Fragment>
      );
    });
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
        <Box>
          <IconButton disabled={!props.onMoveUp} edge="end" aria-label="up" onClick={() => props.onMoveUp()}>
            <ArrowUpward />
          </IconButton>
          <IconButton disabled={!props.onMoveDown} edge="end" aria-label="down" onClick={() => props.onMoveDown()}>
            <ArrowDownward />
          </IconButton>
          <IconButton edge="end" aria-label="down" onClick={() => props.onRename()}>
            <Edit />
          </IconButton>
          <IconButton disabled={!props.onDelete} edge="end" aria-label="delete" onClick={() => props.onDelete()}>
            <Delete />
          </IconButton>
        </Box>
      </Box>
      <Divider sx={{ borderColor: 'black', borderWidth: 1 }} />
      <List onDragOver={handleDragOver} onDrop={handleDrop}>
        {renderQuestions(props.group.questions)}
      </List>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 1,
        }}
      >
        <ControlPointIcon color="primary" onClick={() => props.onAddQuestion()}></ControlPointIcon>
      </Box>
    </Card>
  );
}
