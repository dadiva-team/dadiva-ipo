import React from 'react';
import {Box, Button, ListItem, List, Typography} from '@mui/material';
import {Question} from '../../../domain/Form/Form';
import {EditButton} from '../../form/Inputs';
import DeleteIcon from '@mui/icons-material/Delete';

interface DraggableQuestionProps {
    question: Question;
    subordinateQuestions: Question[];
    groupName: string;
    index: number;
    onDragStart: (event: React.DragEvent) => void;
    onEditRequest: (question: Question) => void;
    onSubEditRequest: (question: Question, parentQuestion: string) => void;
    onDeleteRequest: (question: Question, isSubQuestion: boolean, parentQuestionId: string | null) => void;
}

export function DraggableQuestion(props: DraggableQuestionProps) {
    return (
        <ListItem key={props.question.id}
            draggable
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
                        <EditButton onChangeAnswer={() => props.onEditRequest(props.question)} enableEdit={true}/>
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
                {props.subordinateQuestions.length > 0 && (
                    <List>
                        {props.subordinateQuestions.map(subQuestion => (
                            <ListItem key={subQuestion.id} sx={{display: 'flex', justifyContent: 'space-between'}}>
                                <Typography variant="subtitle1">{subQuestion.text}</Typography>
                                <EditButton
                                    onChangeAnswer={() => props.onSubEditRequest(subQuestion, props.question.id)}
                                    enableEdit={true}/>
                            </ListItem>
                        ))}
                    </List>
                )}
            </Box>
        </ListItem>
    );
}
