import {Group} from '../../../../domain/Form/Form';
import {Submission} from '../../../../domain/Submission/Submission';
import React from 'react';
import {Box, Button, Divider} from '@mui/material';
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
import {Inconsistency} from "../utils/DoctorSearchAux";

interface PendingSubmissionPendingProps {
    formGroups: Group[];
    inconsistencies: Inconsistency[];
    submission: Submission;
    onSubmitedSuccessfully: () => void;
}

export function PendingSubmissionResults({formGroups, submission, inconsistencies, onSubmitedSuccessfully}: PendingSubmissionPendingProps) {
    const {
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
    } = usePendingSubmissionResults({formGroups, submission, inconsistencies, onSubmitedSuccessfully});

    return (
        <Box>
            <Typography>Formulario submetido: {submission.submissionDate}</Typography>
            {invalidQuestions?.length > 0 ? (
                <Box>
                    <ErrorAlert error={'Formulário parcialmente inválido'} clearError={() => setError(null)}/>
                    <Typography variant="h6">
                        Existem inconsistências no formulário. Por favor, reveja as seguintes questões:
                    </Typography>
                    <Divider sx={{p: 0.5}}/>
                    {formWithAnswers.filter(item => invalidQuestions.includes(item.id)).map((item) => (
                        <Box
                            key={item.id}
                            sx={{
                                pl: 1.5,
                                pt: 1,
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '70%'
                            }}
                        >
                            <Typography sx={{width: '70%'}}>{item.question}</Typography>
                            <Typography sx={{width: '30%'}}>Resposta: {item.answer}</Typography>
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
                    startIcon={<ThumbDownIcon/>}
                    sx={{textTransform: 'none'}}
                    onClick={() => handleDialogOpen('rejected')}
                >
                    Rejeitar
                </Button>
                <Button
                    variant="contained"
                    startIcon={<ThumbUpIcon/>}
                    sx={{textTransform: 'none'}}
                    onClick={() => handleDialogOpen('approved')}
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
    );
}
