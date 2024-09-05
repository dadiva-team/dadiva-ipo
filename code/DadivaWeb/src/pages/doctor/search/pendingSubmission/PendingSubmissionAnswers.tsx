import { Box, Divider, Grid, IconButton, Link, Tooltip, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import EditNoteIcon from '@mui/icons-material/EditNote';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { NoteDialog } from './dialog/NoteDialog';
import { usePendingSubmissionAnswers } from './usePendingSubmissionAnswers';
import { Note } from '../../../../domain/Submission/Submission';
import React from 'react';
import { Uris } from '../../../../utils/navigation/Uris';
import {
  SubmissionAnsweredQuestionModel,
  QuestionType,
} from '../../../../services/doctors/models/SubmissionOutputModel';
import DOCTOR_MEDICATION_INFORMATION_COMPLETE = Uris.DOCTOR_MEDICATION_INFORMATION_COMPLETE;

interface PendingSubmissionAnswersProps {
  formWithAnswers: SubmissionAnsweredQuestionModel[];
  inconsistencies?: string[][];
  notes: Note[];
  handleSaveNote: (questionId: string, noteContent: string) => void;
}

export function PendingSubmissionAnswers({
  formWithAnswers,
  inconsistencies,
  notes,
  handleSaveNote,
}: PendingSubmissionAnswersProps) {
  const { open, selectedQuestion, handleClickOpen, handleClose, saveNote, getNoteContent } =
    usePendingSubmissionAnswers({
      notes,
      handleSaveNote,
    });

  return (
    <Box sx={{ border: 0.5, maxHeight: 300, overflowY: 'auto' }}>
      {formWithAnswers.map((item, index) => {
        const isInvalid = inconsistencies?.flat().includes(item.question.id);

        return (
          <Box
            key={index}
            sx={{
              position: 'relative',
              marginBottom: 1,
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={isInvalid ? 9 : 10}>
                <Box p={2} display="flex" alignItems="center">
                  {isInvalid && (
                    <ErrorOutlineIcon
                      color={notes?.some(note => note.id === item.question.id) ? 'success' : 'error'}
                      sx={{ marginRight: 1 }}
                    />
                  )}
                  <Typography variant="body1">{item.question.text}</Typography>
                </Box>
              </Grid>
              {isInvalid && (
                <Grid item xs={1}>
                  <Box display="flex" alignItems="center">
                    <Tooltip title={getNoteContent(item.question.id) ?? 'Sem Nota'} arrow>
                      <IconButton onClick={() => handleClickOpen(item.question)}>
                        {notes?.some(note => note.id === item.question.id) ? <EditNoteIcon /> : <NoteAddIcon />}
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Grid>
              )}
              <Grid item xs={2}>
                {renderAnswer(item)}
              </Grid>
            </Grid>
            {index < formWithAnswers.length - 1 && <Divider />}
          </Box>
        );
      })}
      {selectedQuestion && (
        <NoteDialog note={getNoteContent(selectedQuestion.id)} open={open} onAnswer={saveNote} onClose={handleClose} />
      )}
    </Box>
  );
}

// Temporary function to render the answer
export const renderAnswer = (questionWAnswer: SubmissionAnsweredQuestionModel) => {
  const answer = questionWAnswer.answer;
  if (questionWAnswer.question.type == QuestionType.boolean) {
    return answer ? <CheckIcon color="success" /> : <CloseIcon color="error" />;
  } else if (questionWAnswer.question.type == QuestionType.text) {
    return (
      <Typography
        variant="body1"
        sx={{
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap',
          overflowWrap: 'break-word',
        }}
      >
        {answer.toString()}
      </Typography>
    );
  } else if (questionWAnswer.question.type == QuestionType.medications && Array.isArray(answer)) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Grid container direction="column">
          {answer.map(ans => (
            <Link
              target="_blank"
              key={ans}
              href={DOCTOR_MEDICATION_INFORMATION_COMPLETE(ans)}
              sx={{
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
              }}
            >
              {ans + ' '}
            </Link>
          ))}
        </Grid>
      </Box>
    );
  } else if (
    (questionWAnswer.question.type == QuestionType.dropdown ||
      questionWAnswer.question.type == QuestionType.countries) &&
    Array.isArray(answer)
  ) {
    return (
      <Typography
        sx={{
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap',
          overflowWrap: 'break-word',
        }}
      >
        {answer.join(', ')}
      </Typography>
    );
  } else {
    return (
      <Typography
        variant="body1"
        sx={{
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap',
          overflowWrap: 'break-word',
        }}
      >
        {answer}
      </Typography>
    );
  }
};
