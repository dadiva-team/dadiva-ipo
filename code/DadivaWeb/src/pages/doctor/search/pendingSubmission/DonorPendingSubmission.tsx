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
      <Typography>Formulario submetido: {submission.submissionDate}</Typography>
      {inconsistencies?.length > 0 ? (
        <Box>
          <InfoAlert actionMessage={'Formulário parcialmente inválido'} type={'error'} />
          <Typography variant="h6">
            Existem inconsistências no formulário. Por favor, reveja as seguintes questões:
          </Typography>
          <Divider sx={{ p: 0.5 }} />
          {formWithAnswers
            .filter(item => inconsistencies?.flat().includes(item.question.id))
            .map(item => (
              <Box
                key={item.id}
                sx={{
                  pl: 1.5,
                  pt: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '70%',
                }}
              >
                <Typography sx={{ width: '70%' }}>{item.question.text}</Typography>
                <Typography sx={{ width: '30%' }}>Resposta: {item.answer.toString()}</Typography>
              </Box>
            ))}
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
        invalidQuestionsLength={inconsistencies?.length || 0}
        notesLength={notes.length}
        handleDialogClose={handleDialogClose}
        handleDialogSubmit={handleDialogSubmit}
        setFinalNote={setFinalNote}
        isSubmitting={isSubmitting}
      />
    </Box>
  );
}
