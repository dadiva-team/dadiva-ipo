import React from 'react';
import { Box, Button, Divider } from '@mui/material';
import Typography from '@mui/material/Typography';
import { PendingSubmissionAnswers } from './PendingSubmissionAnswers';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import CloseIcon from '@mui/icons-material/Close';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { useDonorPendingSubmission } from './useDonorPendingSubmission';
import { ReviewDialog } from './dialog/ReviewDialog';
import { InfoAlert } from '../../../../components/shared/InfoAlert';
import { SubmissionModel } from '../../../../services/doctors/models/SubmissionOutputModel';
import { translateResponse } from '../../../../components/backoffice/editForm/utils';

interface DonorPendingSubmissionProps {
  submission: SubmissionModel;
  onSubmittedSuccessfully: () => void;
}

export function DonorPendingSubmission({ submission, onSubmittedSuccessfully }: DonorPendingSubmissionProps) {
  const {
    formWithAnswers,
    inconsistencies,
    notes,
    showDetails,
    dialogOpen,
    dialogType,
    finalNote,
    isSubmitting,
    setShowDetails,
    handleSaveNote,
    handleDialogOpen,
    handleDialogClose,
    handleDialogSubmit,
    setFinalNote,
  } = useDonorPendingSubmission({ submission, onSubmittedSuccessfully });

  return (
    <Box>
      <Typography>Formulario submetido: {new Date(submission.submissionDate).toLocaleString()}</Typography>
      {inconsistencies?.length > 0 ? (
        <Box>
          <InfoAlert actionMessage={'Formulário parcialmente inválido'} type={'error'} />
          <Typography variant="h6">
            Existem {inconsistencies.length <= 1 ? '' : 'grupos de '} inconsistências no formulário. Por favor, reveja
            as seguintes questões:
          </Typography>
          <Divider sx={{ p: 0.5, mb: 1 }} />
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, justifyContent: 'space-evenly' }}>
            {inconsistencies.map((inconsistencyGroup, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  justifyContent: 'space-between',
                  border: 1,
                  p: 1,
                  borderRadius: 5,
                }}
              >
                {inconsistencyGroup.map(questionId => {
                  const questionItem = formWithAnswers.find(item => item.question.id === questionId);
                  if (!questionItem) return null;

                  return (
                    <Box
                      key={questionId}
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        textAlign: 'left',
                      }}
                    >
                      <Typography sx={{ flex: '1 1 85%', wordWrap: 'break-word' }}>
                        {questionItem.question.text}
                      </Typography>
                      <Typography sx={{ flex: '1 1 15%', textAlign: 'right', wordWrap: 'break-word' }}>
                        - {translateResponse(questionItem.answer.toString())}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            ))}
          </Box>
        </Box>
      ) : (
        <InfoAlert actionMessage={'Formulario parcialmente validado'} type={'info'} />
      )}
      <Box sx={{ pt: 2 }}>
        <Button
          variant="outlined"
          endIcon={!showDetails ? <ManageSearchIcon /> : <CloseIcon />}
          onClick={() => setShowDetails(!showDetails)}
        >
          Respostas
        </Button>
      </Box>
      {showDetails && formWithAnswers && (
        <Box sx={{ pt: 2 }}>
          <PendingSubmissionAnswers
            formWithAnswers={formWithAnswers}
            inconsistencies={inconsistencies}
            notes={notes}
            handleSaveNote={handleSaveNote}
          />
        </Box>
      )}
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button
          variant="contained"
          startIcon={<ThumbDownIcon />}
          sx={{ textTransform: 'none' }}
          onClick={() => handleDialogOpen(false)} // Open Rejection Dialog
        >
          Rejeitar
        </Button>
        <Button
          variant="contained"
          startIcon={<ThumbUpIcon />}
          sx={{ textTransform: 'none' }}
          onClick={() => handleDialogOpen(true)} // Open Approval Dialog
        >
          Aprovar
        </Button>
      </Box>
      <ReviewDialog
        dialogOpen={dialogOpen}
        dialogType={dialogType}
        finalNote={finalNote}
        handleDialogClose={handleDialogClose}
        handleDialogSubmit={handleDialogSubmit}
        setFinalNote={setFinalNote}
        isSubmitting={isSubmitting}
      />
    </Box>
  );
}
