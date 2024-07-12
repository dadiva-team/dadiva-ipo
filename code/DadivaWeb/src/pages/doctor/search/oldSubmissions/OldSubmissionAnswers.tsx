import {Box, Grid, Typography, Divider, Tooltip} from '@mui/material';
import {QuestionWithAnswer} from '../utils/DoctorSearchAux';
import React, {useEffect} from 'react';
import {renderAnswer} from "../pendingSubmission/FormDetails";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import NotesIcon from '@mui/icons-material/Notes';
import {Note} from "../../../../domain/Submission/Submission";

interface OldSubmissionsAnswersProps {
    formWithAnswers: QuestionWithAnswer[];
    invalidQuestions: string[] | null;
    notes: Note[] | null;
}

export function OldSubmissionsAnswers({formWithAnswers, invalidQuestions, notes}: OldSubmissionsAnswersProps) {
    useEffect(() => {
        console.log('notes', notes);
    }, [notes]);

    return (
        <Box sx={{border: 0.5, maxHeight: 300, overflowY: 'auto'}}>
            {formWithAnswers.map((item, index) => {
                const isInvalid = invalidQuestions?.some(invalid => invalid === item.id);
                const note = notes?.find(note => note.id === item.id);

                return (
                    <Box
                        key={index}
                        sx={{
                            position: 'relative',
                            marginBottom: 0.2,
                        }}
                    >
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={note  ? 8 : 9}>
                                <Box p={2} display="flex" alignItems="center">
                                    {isInvalid && (
                                        <ErrorOutlineIcon
                                            color={'error'}
                                            sx={{marginRight: 1}}
                                        />
                                    )}
                                    <Typography variant="body1">{item.question}</Typography>
                                </Box>
                            </Grid>
                            {isInvalid && note && (
                                <Grid item xs={1}>
                                    <Box display="flex" alignItems="center">
                                        <Tooltip
                                            title={notes?.find(note => note.id === item.id)?.note || 'No note found'}
                                            arrow
                                        >
                                            <NotesIcon/>
                                        </Tooltip>
                                    </Box>
                                </Grid>
                            )}
                            <Grid item xs={3}>
                                {renderAnswer(item)}
                            </Grid>
                        </Grid>
                        {index < formWithAnswers.length - 1 && <Divider/>}
                    </Box>
                );
            })}
        </Box>
    );
}
