import {Group} from '../../../../domain/Form/Form';
import {Submission} from '../../../../domain/Submission/Submission';
import React from 'react';
import {Box, Button,Divider} from '@mui/material';
import LoadingSpinner from '../../../../components/shared/LoadingSpinner';
import {ErrorAlert} from '../../../../components/shared/ErrorAlert';
import Typography from '@mui/material/Typography';
import {FormDetails} from './FormDetails';
import {PendingActionAlert} from '../../../../components/shared/PendingActionAlert';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import CloseIcon from '@mui/icons-material/Close';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import {usePendingSubmissionResults} from "./usePendingSubmissionResults";
import {ReviewDialog} from "./ReviewDialog";

interface PendingSubmissionPendingProps {
    formGroups: Group[];
    submission: Submission;
}

export function PendingSubmissionResults({formGroups, submission}: PendingSubmissionPendingProps) {
    const {
        error,
        isLoading,
        formWithAnswers,
        invalidQuestions,
        notes,
        showDetails,
        dialogOpen,
        dialogType,
        finalNote,
        isSubmitting,
        setError,
        setShowDetails,
        handleSaveNote,
        handleDialogOpen,
        handleDialogClose,
        handleDialogSubmit,
        setFinalNote,
    } = usePendingSubmissionResults({ formGroups, submission });

    return (
        <Box>
            {isLoading ? (
                <Box sx={{mt: 1}}>
                    <LoadingSpinner text={'A calcular...'}/>
                    <ErrorAlert error={error} clearError={() => setError(null)}/>
                </Box>
            ) : (
                <Box>
                    <Typography>Formulario submetido: {submission.submissionDate}</Typography>
                    {invalidQuestions?.length > 0 ? (
                        <Box>
                            <ErrorAlert error={'Formulário parcialmente inválido'} clearError={() => setError(null)}/>
                            <Typography variant="h6">
                                Existem inconsistências no formulário. Por favor, reveja as seguintes questões:
                            </Typography>
                            <Divider sx={{p: 0.5}}/>
                            {invalidQuestions.map(question => (
                                <Box
                                    key={question.id}
                                    sx={{
                                        pl: 1.5,
                                        pt: 1,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        width: '70%'
                                    }}
                                >
                                    <Typography sx={{width: '70%'}}>{question.question}</Typography>
                                    <Typography sx={{width: '30%'}}>Resposta: {question.answer}</Typography>
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <PendingActionAlert
                            actionMessage={'Formulario parcialmente validado'}
                            clearActionMessage={() => console.log(':D')}
                        />
                    )}
                    <Box sx={{pt: 2}}>
                        <Button
                            variant="outlined"
                            endIcon={!showDetails ? <ManageSearchIcon/> : <CloseIcon/>}
                            onClick={() => setShowDetails(!showDetails)}
                        >
                            Respostas
                        </Button>
                    </Box>
                    {showDetails && formWithAnswers && (
                        <Box sx={{pt: 2}}>
                            <FormDetails
                                formWithAnswers={formWithAnswers} invalidQuestions={invalidQuestions}
                                notes={notes}
                                handleSaveNote={handleSaveNote}/>
                        </Box>
                    )}
                    <Box sx={{display: 'flex', gap: 2, mt: 2}}>
                        <Button
                            variant="contained"
                            startIcon={<ThumbDownIcon />}
                            sx={{ textTransform: 'none' }}
                            onClick={() => handleDialogOpen('disapprove')}
                        >
                            Rejeitar
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<ThumbUpIcon />}
                            sx={{ textTransform: 'none' }}
                            onClick={() => handleDialogOpen('approve')}
                        >
                            Aprovar
                        </Button>
                    </Box>
                    <ReviewDialog
                        dialogOpen={dialogOpen}
                        dialogType={dialogType}
                        finalNote={finalNote}
                        invalidQuestionsLength={invalidQuestions?.length || 0}
                        notesLength={notes.length}
                        handleDialogClose={handleDialogClose}
                        handleDialogSubmit={handleDialogSubmit}
                        setFinalNote={setFinalNote}
                        isSubmitting={isSubmitting}
                    />
                </Box>
            )}
        </Box>
    );
}
