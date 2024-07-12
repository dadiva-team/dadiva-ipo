import {Box, Grid, Typography, IconButton, Tooltip, Divider, Link} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import EditNoteIcon from '@mui/icons-material/EditNote';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {NoteDialog} from './NoteDialog';
import {useFormDetails} from './useFormDetails';
import {QuestionWithAnswer} from '../utils/DoctorSearchAux';
import {Note} from '../../../../domain/Submission/Submission';
import React from 'react';
import {Uris} from '../../../../utils/navigation/Uris';
import DOCTOR_MEDICATION_INFORMATION_COMPLETE = Uris.DOCTOR_MEDICATION_INFORMATION_COMPLETE;

interface FormDetailsProps {
    formWithAnswers: QuestionWithAnswer[];
    invalidQuestions?: string[];
    notes: Note[];
    handleSaveNote: (questionId: string, noteContent: string) => void;
}

export function FormDetails({formWithAnswers, invalidQuestions, notes, handleSaveNote}: FormDetailsProps) {
    const {open, selectedQuestion, handleClickOpen, handleClose, saveNote, getNoteContent} = useFormDetails({
        notes,
        handleSaveNote,
    });

    return (
        <Box sx={{border: 0.5}}>
            {formWithAnswers.map((item, index) => {
                const isInvalid = invalidQuestions?.some(invalid => invalid === item.id);

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
                                            color={notes?.some(note => note.id === item.id) ? 'success' : 'error'}
                                            sx={{marginRight: 1}}
                                        />
                                    )}
                                    <Typography variant="body1">{item.question}</Typography>
                                </Box>
                            </Grid>
                            {isInvalid && (
                                <Grid item xs={1}>
                                    <Box display="flex" alignItems="center">
                                        <Tooltip title={getNoteContent(item.id) ?? 'Sem Nota'} arrow>
                                            <IconButton onClick={() => handleClickOpen(item)}>
                                                {notes?.some(note => note.id === item.id) ? <EditNoteIcon/> :
                                                    <NoteAddIcon/>}
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Grid>
                            )}
                            <Grid item xs={2}>
                                {renderAnswer(item)}
                            </Grid>
                        </Grid>
                        {index < formWithAnswers.length - 1 && <Divider/>}
                    </Box>
                );
            })}
            {selectedQuestion && (
                <NoteDialog note={getNoteContent(selectedQuestion.id)} open={open} onAnswer={saveNote}
                            onClose={handleClose}/>
            )}
        </Box>
    );
}

// Temporary function to render the answer
export const renderAnswer = (qwa: QuestionWithAnswer) => {
    const answer = qwa.answer;
    if (typeof answer === 'boolean') {
        return answer ? <CheckIcon color="success"/> : <CloseIcon color="error"/>;
    } else if (typeof answer === 'string') {
        if (answer.toLowerCase() === 'yes') {
            return <CheckIcon color="success"/>;
        } else if (answer.toLowerCase() === 'no') {
            return <CloseIcon color="error"/>;
        } else {
            return <Typography variant="body1">{answer}</Typography>;
        }
    } else if (typeof answer === 'object') {
        return (
            <Grid container direction="column">
                {answer.map(ans => (
                    <Link target="_blank" key={ans} href={DOCTOR_MEDICATION_INFORMATION_COMPLETE(ans)}>
                        {ans}
                    </Link>
                ))}
            </Grid>
        );
    } else {
        return <Typography variant="body1">{answer}</Typography>;
    }
};