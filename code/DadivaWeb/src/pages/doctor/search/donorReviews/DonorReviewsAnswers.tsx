import { Box, Grid, Typography, Divider, Tooltip } from '@mui/material';
import React from 'react';
import { renderAnswer } from '../pendingSubmission/PendingSubmissionAnswers';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import NotesIcon from '@mui/icons-material/Notes';
import { SubmissionModel } from '../../../../services/doctors/models/SubmissionOutputModel';
import { checkInconsistencies } from '../utils/DoctorSearchUtils';

interface DonorReviewsAnswersProps {
  submission: SubmissionModel;
  isLastSubmission: boolean;
  notesVisible: boolean;
}

export function DonorReviewsAnswers({ submission, notesVisible }: DonorReviewsAnswersProps) {
  const inconsistencies = checkInconsistencies(submission.answeredQuestions, submission?.inconsistencies);

  return (
    <Box sx={{ border: 0.5, maxHeight: 300, maxWidth: '100%', overflowY: 'auto' }}>
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
              <Grid item xs={item.noteText && notesVisible ? 8 : 9}>
                <Box p={2} display="flex" alignItems="center">
                  {isInvalid && <ErrorOutlineIcon color={'error'} sx={{ marginRight: 1 }} />}
                  <Typography variant="body1">{item.question.text}</Typography>
                </Box>
              </Grid>

              {item.noteText && notesVisible && (
                <Grid item xs={1}>
                  <Box display="flex" justifyContent="center" alignItems="center">
                    <Tooltip title={item.noteText || 'No note found'} arrow>
                      <NotesIcon />
                    </Tooltip>
                  </Box>
                </Grid>
              )}

              <Grid item xs={3}>
                <Box display="flex" justifyContent="flex-end" p={0.5} pr={2} sx={{ overflow: 'hidden' }}>
                  {renderAnswer(item)}
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ mt: 1 }} />
          </Box>
        );
      })}
    </Box>
  );
}
