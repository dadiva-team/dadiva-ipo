import React, {useEffect, useCallback, useState} from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    TextField,
    Typography,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import {Close, Edit} from '@mui/icons-material';
import {Question, ShowCondition} from '../../../../domain/Form/Form';
import {ErrorAlert} from '../../../shared/ErrorAlert';
import {useDialog} from './useDialog';
import {DropdownOptionsForm} from './DropdownOptionsForm';
import {PendingActionAlert} from "../../../shared/PendingActionAlert";

export interface SubQuestionEditDialogProps {
    open: boolean;
    question: Question;
    questions: Question[];
    onAnswer: (
        id: string,
        text: string,
        type: string,
        options: string[] | null,
        showCondition?: ShowCondition,
        parentQuestionId?: string | null
    ) => void;
    onDeleteSubQuestion: (question: Question, isSubQuestion: boolean, parentQuestionId: string | null) => void;
    onClose: () => void;
}

export function SubQuestionEditDialog(
    {
        open,
        question,
        questions,
        onAnswer,
        onDeleteSubQuestion,
        onClose
    }: SubQuestionEditDialogProps) {
    const {
        questionId,
        setQuestionId,
        questionText,
        setQuestionText,
        questionType,
        setQuestionType,
        questionOptions,
        setQuestionOptions,
        optionInput,
        setOptionInput,
        error,
        setError,
        handleAddOption,
        handleRemoveOption,
        moveOptionUp,
        moveOptionDown,
    } = useDialog();

    const [showCondition, setShowCondition] = useState<ShowCondition>(question?.showCondition ?? {if: {}});
    const [questionCondition, setQuestionCondition] = useState<string | null>(null);
    const [conditionAnswer, setConditionAnswer] = useState<string | null>(null);
    const [editingCondition, setEditingCondition] = useState<boolean>(false);
    const [intendedAction, setIntendedAction] = useState<'remove' | 'return'>(null);
    const [alert, setAlert] = useState<string | null>(null);

    useEffect(() => {
        if (question) {
            setQuestionId(question.id);
            setQuestionText(question.text);
            setQuestionType(question.type);
            setQuestionOptions(question.options ?? []);
            setShowCondition(question.showCondition ?? {if: {}});

            if (question.showCondition) {
                const validConditionKey = Object.keys(question.showCondition.if)[0];
                setQuestionCondition(validConditionKey);
                setConditionAnswer(question.showCondition.if[validConditionKey]);
            }
        }
    }, [question, setQuestionId, setQuestionOptions, setQuestionText, setQuestionType]);

    const handleCloseAndAnswer = useCallback(() => {
        if (questionText.trim() === '') {
            setError('O texto da pergunta não pode estar vazio');
            return;
        }
        if (questionType === 'dropdown' && (questionOptions == null || questionOptions.length < 2)) {
            setError('Uma pergunta de escolha múltipla deve ter pelo menos duas opções');
            return;
        }
        if (questionCondition && !conditionAnswer) {
            setError('A condição de ativação da pergunta não pode estar vazia');
            return;
        }
        if (questionCondition && !questions.find(q => q.id === questionCondition)) {
            setError('A pergunta de ativação não existe');
            return;
        }
        if (editingCondition) {
            setError('Termine de editar a condição de ativação');
            return;
        }

        if (intendedAction === 'remove') {
            onDeleteSubQuestion(question, false, null);
            onClose();
        } else if (intendedAction === 'return') {
            onDeleteSubQuestion(question, true, questions?.find(q => q.id === questionCondition)?.id);
            onClose();
        } else {
            onAnswer(questionId, questionText, questionType, questionOptions, showCondition, questionCondition);
            onClose();
        }

    }, [questionText, questionType, questionOptions, questionCondition, conditionAnswer, questions, editingCondition, onAnswer, questionId, showCondition, onClose, setError, intendedAction, onDeleteSubQuestion, question]);

    function handleChangeCondition() {
        setShowCondition(oldShowCondition => {
            const newShowCondition = {...oldShowCondition};
            newShowCondition.if[questionCondition] = conditionAnswer;
            return newShowCondition;
        });
    }

    function translateResponse(response: string) {
        return response === 'yes' ? 'Sim' : response === 'no' ? 'Não' : response;
    }

    function createQuestionAnswersInput(question?: Question) {
        if (!question) {
            return (
                <>
                    <InputLabel id="selecionar-resposta-label">Resposta</InputLabel>
                    <Select
                        disabled={true}
                        labelId="selecionar-resposta-label"
                        id="selecionar-resposta-label"
                        value=""
                        label="Resposta"
                    ></Select>
                </>
            );
        }

        switch (question.type) {
            case 'boolean':
                return (
                    <>
                        <InputLabel id="selecionar-resposta-label">Resposta</InputLabel>
                        <Select
                            disabled={!questionCondition}
                            labelId="selecionar-resposta-label"
                            id="selecionar-resposta-label"
                            value={conditionAnswer ?? ''}
                            label="Resposta"
                            onChange={event => {
                                setConditionAnswer(event.target.value);
                            }}
                        >
                            <MenuItem value="yes">Sim</MenuItem>
                            <MenuItem value="no">Não</MenuItem>
                        </Select>
                    </>
                );
            case 'text':
                return (
                    <>
                        <InputLabel id="selecionar-resposta-label">Resposta</InputLabel>
                        <TextField
                            disabled={!questionCondition}
                            id="selecionar-resposta"
                            label="Resposta"
                            value={conditionAnswer ?? ''}
                            onChange={event => setConditionAnswer(event.target.value)}
                        />
                    </>
                );
            case 'dropdown':
                return (
                    <>
                        <InputLabel id="selecionar-resposta-label">Resposta</InputLabel>
                        <Select
                            disabled={!questionCondition}
                            labelId="selecionar-resposta-label"
                            id="selecionar-resposta-label"
                            value={conditionAnswer ?? ''}
                            label="Reesposta"
                            onChange={event => {
                                setConditionAnswer(event.target.value);
                            }}
                        >
                            {question.options.map(option => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </>
                );
        }
    }

    return (
        <Dialog onClose={onClose} open={open} aria-labelledby="edit-dialog-title" maxWidth="md" fullWidth>
            <DialogTitle id="edit-dialog-title">Editar a Questão Subordinada</DialogTitle>
            <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => onClose()}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: '5%',
                }}
            >
                <Close fontSize="inherit"/>
            </IconButton>
            <DialogContent dividers>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <FormControl fullWidth>
                        <TextField
                            id="demo-simple-textfield"
                            value={questionText}
                            label="Corpo da Pergunta"
                            onChange={event => {
                                setQuestionText(event.target.value);
                            }}
                        />
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Tipo de Resposta</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={questionType ?? ''}
                            label="Tipo de Resposta"
                            onChange={event => {
                                setQuestionType(event.target.value);
                            }}
                        >
                            <MenuItem value={'boolean'}>Sim ou Não</MenuItem>
                            <MenuItem value={'text'}>Texto</MenuItem>
                            <MenuItem value={'dropdown'}>Escolha Múltipla</MenuItem>
                        </Select>
                    </FormControl>
                    {questionType === 'dropdown' && (
                        <DropdownOptionsForm
                            optionInput={optionInput}
                            questionOptions={questionOptions}
                            setOptionInput={setOptionInput}
                            handleAddOption={handleAddOption}
                            handleRemoveOption={handleRemoveOption}
                            moveOptionUp={moveOptionUp}
                            moveOptionDown={moveOptionDown}
                        />
                    )}
                    <Box>
                        <Button
                            onClick={() => {
                                setIntendedAction('remove');
                                setAlert('Tem a certeza que deseja remover esta pergunta?')
                            }}>
                            Remover pergunta
                        </Button>
                        <Button
                            onClick={() => {
                                setIntendedAction('return');
                                setAlert('Tem a certeza que deseja devolver esta pergunta à pool?')
                            }}>
                            Devolver pergunta à pool
                        </Button>
                    </Box>

                    <Divider/>
                    {
                        intendedAction === null && (

                            <FormControl fullWidth>
                                <Typography variant="h6" sx={{mt: 1}}>
                                    Condições que ativam a pergunta
                                </Typography>
                                <List>
                                    {Object.keys(showCondition?.if).map((fact, index) => (
                                        <ListItem key={index}>
                                            <ListItemText
                                                sx={{width: "70%"}}
                                                primary={`${questions?.find(q => q.id === fact)?.text} = ${translateResponse(showCondition.if[fact])}`}
                                            />
                                            {editingCondition && (
                                                <Box flexDirection="column" sx={{width: "25%"}}>
                                                    <FormControl fullWidth margin="normal" sx={{width: "100%"}}>
                                                        {createQuestionAnswersInput(questions?.find(q => q.id === questionCondition))}
                                                    </FormControl>
                                                    <Button
                                                        disabled={!questionCondition || !conditionAnswer}
                                                        onClick={() => {
                                                            handleChangeCondition();
                                                            setEditingCondition(false);
                                                        }}
                                                    >
                                                        Guardar
                                                    </Button>
                                                </Box>
                                            )}
                                            {!editingCondition && (
                                                <Box sx={{
                                                    width: "25%",
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    justifyContent: "flex-end"
                                                }}>
                                                    <IconButton aria-label="edit" onClick={() => setEditingCondition(true)}>
                                                        <Edit/>
                                                    </IconButton>
                                                </Box>
                                            )}
                                        </ListItem>
                                    ))}
                                </List>
                            </FormControl>
                        )}
                    {error && <ErrorAlert error={error} clearError={() => setError(null)}/>}
                    {alert && <PendingActionAlert actionMessage={alert} clearActionMessage={() => {
                        setAlert(null);
                        setIntendedAction(null)
                    }}/>}

                    <Button
                        onClick={() => {
                            handleCloseAndAnswer();
                        }}
                    >
                        Save
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
