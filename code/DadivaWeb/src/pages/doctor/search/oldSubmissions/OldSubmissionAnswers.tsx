import { Box, Grid, Typography, Divider, Tooltip } from '@mui/material';
import React from 'react';
import { renderAnswer } from '../pendingSubmission/FormDetails';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import NotesIcon from '@mui/icons-material/Notes';
import { SubmissionModel } from '../../../../services/doctors/models/SubmissionOutputModel';
import { checkInconsistencies } from '../utils/DoctorSearchUtils';

interface OldSubmissionsAnswersProps {
  submission: SubmissionModel;
  isLastSubmission: boolean;
}

export function OldSubmissionsAnswers({ submission, isLastSubmission }: OldSubmissionsAnswersProps) {
  const inconsistencies = checkInconsistencies(submission.answeredQuestions, submission?.inconsistencies);

  return (
    <Box sx={{ border: 0.5, maxHeight: 300, overflowY: 'auto' }}>
      {submission.answeredQuestions.map((item, index) => {
        const isInvalid = inconsistencies?.flat().includes(item.question.id);

        return (
          <Box
            key={index}
            sx={{
              position: 'relative',
              marginBottom: 0.2,
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={item.noteText ? 8 : 9}>
                <Box p={2} display="flex" alignItems="center">
                  {isInvalid && <ErrorOutlineIcon color={'error'} sx={{ marginRight: 1 }} />}
                  <Typography variant="body1">{item.question.text}</Typography>
                </Box>
              </Grid>
              {isInvalid && item.noteText && (
                <Grid item xs={1}>
                  <Box display="flex" alignItems="center">
                    <Tooltip title={item.noteText || 'No note found'} arrow>
                      <NotesIcon />
                    </Tooltip>
                  </Box>
                </Grid>
              )}
              <Grid item xs={3}>
                <Box display="flex" alignItems="center" p={0.5}>
                  {renderAnswer(item)}
                </Box>
              </Grid>
            </Grid>
            {isLastSubmission && <Divider />}
          </Box>
        );
      })}
    </Box>
  );
}
