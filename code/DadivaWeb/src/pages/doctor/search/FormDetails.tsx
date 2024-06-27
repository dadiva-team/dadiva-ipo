import {Box, Grid, Typography, IconButton, Tooltip, Divider} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import EditNoteIcon from '@mui/icons-material/EditNote';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {NoteDialog} from './NoteDialog';
import {useFormDetails} from './useFormDetails';
import {QuestionWithAnswer} from './utils/DoctorSearchAux';
import {Note} from "../../../domain/Submission";
import React from "react";

interface FormDetailsProps {
    formWithAnswers: QuestionWithAnswer[];
    invalidQuestions?: QuestionWithAnswer[];
    notes: Note[];
    handleSaveNote: (questionId: string, noteContent: string) => void;
}

export function FormDetails({formWithAnswers, invalidQuestions, notes, handleSaveNote}: FormDetailsProps) {
    const {
        open,
        selectedQuestion,
        handleClickOpen,
        handleClose,
        saveNote,
        getNoteContent
    } = useFormDetails({notes, handleSaveNote});

    // Temporary function to render the answer
    const renderAnswer = (answer: string | boolean) => {
        if (typeof answer === 'boolean') {
            return answer ? <CheckIcon color="success"/> : <CloseIcon color="error"/>;
        } else if (answer.toLowerCase() === 'yes') {
            return <CheckIcon color="success"/>;
        } else if (answer.toLowerCase() === 'no') {
            return <CloseIcon color="error"/>;
        } else {
            return <Typography variant="body1">{answer}</Typography>;
        }
    };

    return (
        <Box sx={{border: 0.5}}>
            {formWithAnswers.map((item, index) => {
                const isInvalid = invalidQuestions?.some(invalid => invalid.id === item.id);

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
                                            color={notes?.some(note => note.id === item.id) ? "success" : "error"}
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
                                {renderAnswer(item.answer)}
                            </Grid>
                        </Grid>
                        {index < formWithAnswers.length - 1 && <Divider/>}
                    </Box>
                );
            })}
            {selectedQuestion && (
                <NoteDialog
                    note={getNoteContent(selectedQuestion.id)}
                    open={open}
                    onAnswer={saveNote}
                    onClose={handleClose}
                />
            )}
        </Box>
    );
}
