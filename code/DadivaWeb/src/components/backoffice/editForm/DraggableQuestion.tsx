import React, {useState} from 'react';
import {Box, Button, List, ListItem, Typography} from '@mui/material';
import {Question} from '../../../domain/Form/Form';
import {EditButton} from '../../form/Inputs';
import DeleteIcon from '@mui/icons-material/Delete';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import {ErrorAlert} from "../../shared/ErrorAlert";

interface DraggableQuestionProps {
    question: Question;
    parentQuestions: Question[];
    groupName: string;
    index: number;
    onDragStart: (event: React.DragEvent) => void;
    onEditRequest: (question: Question) => void;
    onSubEditRequest: (question: Question) => void;
    onDeleteRequest: (question: Question, isSubQuestion: boolean, parentQuestionId: string | null) => void;
    onDragError: string | null;
    onDragErrorClear: () => void;
}

export function DraggableQuestion(props: DraggableQuestionProps) {
    const [isListVisible, setIsListVisible] = useState(false);
    return (
        <ListItem key={props.question.id}
                  draggable={props.parentQuestions.length == 0}
                  onDragStart={event => {
                      event.dataTransfer.setData('questionID', props.question.id);
                      event.dataTransfer.setData('questionIndex', props.index.toString());
                      props.onDragStart(event);
                  }}
                  style={{cursor: 'grab'}}
                  sx={{
                      bgcolor: '#ffffff',
                      '&:hover': {
                          bgcolor: '#aaaaaa',
                      },
                  }}
        >
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    mt: 1,
                }}
            >
                {props.parentQuestions.length > 0 &&
                    <Button variant="outlined" sx={{
                        width: '20%',
                        color: 'white',
                        bgcolor: 'red',
                    }}>Subquestão</Button>}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <Typography variant="h6" sx={{mb: 1}}>
                        {props.question.text}
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            gap: 1,
                        }}
                    >
                        <EditButton
                            onChangeAnswer={() => props.parentQuestions.length == 0 ? props.onEditRequest(props.question) : props.onSubEditRequest(props.question)}
                            enableEdit={true}/>
                        <Button
                            color="warning"
                            variant="outlined"
                            onClick={() => props.onDeleteRequest(props.question, false, null)}
                            startIcon={<DeleteIcon/>}
                            sx={{borderRadius: 50, height: 40}}
                        >
                            Apagar
                        </Button>
                    </Box>
                </Box>
                {props.onDragError && <ErrorAlert error={props.onDragError} clearError={() => props.onDragErrorClear()}/>}
                {props.parentQuestions.length > 0 && (
                    <>
                        <Box sx={{flexDirection: 'row', justifyContent: 'space-around'}}>

                            <Button size="small" variant={isListVisible ? "text" : "outlined"}
                                    onClick={() => setIsListVisible(!isListVisible)}
                                    endIcon={isListVisible ? <PlaylistRemoveIcon/> : <PlaylistPlayIcon/>}>
                            </Button>
                        </Box>
                        {isListVisible && (
                            <>

                                <List>
                                    {props.parentQuestions.map((parentQuestion) => (
                                        <ListItem key={parentQuestion.id}
                                                  sx={{display: 'flex', justifyContent: 'space-between'}}>
                                            <Typography variant="subtitle1">{parentQuestion.text}</Typography>
                                        </ListItem>
                                    ))}
                                </List>
                            </>
                        )}
                    </>
                )}
            </Box>
        </ListItem>
    )
        ;
}
