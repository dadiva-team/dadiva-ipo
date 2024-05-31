import {useState, useEffect} from 'react';
import {handleError, handleRequest} from '../../../services/utils/fetch';
import {useNavigate} from 'react-router-dom';
import {Form, Group as GroupDomain, Question, ShowCondition} from '../../../domain/Form/Form';
import {FormServices} from '../../../services/from/FormServices';
import {RuleProperties, TopLevelCondition} from 'json-rules-engine';

export function useEditFormPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [editingQuestion, setEditingQuestion] = useState<Question>(null);
    const [editingSubQuestion, setEditingSubQuestion] = useState<Question>(null);

    type DeletingQuestionState = {
        question: Question | null;
        isSubQuestion: boolean;
        parentQuestionId: string | null;
    };

    const [deletingQuestion, setDeletingQuestion] = useState<DeletingQuestionState>(null)

    const [creatingQuestion, setCreatingQuestion] = useState(false);

    const [editingGroup, setEditingGroup] = useState<GroupDomain>(null);
    const [deletingGroup, setDeletingGroup] = useState<GroupDomain>(null);
    const [creatingGroup, setCreatingGroup] = useState(false);
    const [creatingQuestionInGroup, setCreatingQuestionInGroup] = useState<GroupDomain>(null);

    const nav = useNavigate();
    const [dropError, setDropError] = useState<{ id: string, msg: string }>(null);
    const [error, setError] = useState<string | null>(null);
    const [formFetchData, setFormFetchData] = useState<Form>();

    useEffect(() => {
        const fetch = async () => {
            const [error, res] = await handleRequest(FormServices.getForm());
            if (error) {
                handleError(error, setError, nav);
                return;
            }
            setFormFetchData(res as Form);
            setIsLoading(false);
        };

        if (isLoading) fetch();
    }, [isLoading, nav]);

    function calculateFromShowConditions(showCondition: ShowCondition): TopLevelCondition {
        const condition: TopLevelCondition = {all: []};

        if (showCondition?.after) {
            showCondition.after.forEach(questionID => {
                condition['all'].push({
                    fact: questionID,
                    operator: 'notEqual',
                    value: '',
                });
            });
        }

        if (showCondition?.if) {
            Object.keys(showCondition.if).forEach(questionID => {
                condition['all'].push({
                    fact: questionID,
                    operator: 'equal',
                    value: showCondition.if[questionID],
                });
            });
        }

        return condition;
    }

    function calculateFromPreviousQuestion(question: Question) {
        if (!question.showCondition) {
            return {
                all: [
                    {
                        fact: question.id,
                        operator: 'notEqual',
                        value: '',
                    },
                ],
            };
        }
        return {
            any: [
                {
                    fact: question.id,
                    operator: 'notEqual',
                    value: '',
                },
                {
                    all: [
                        {
                            any: Object.keys(question.showCondition.if).map(fact => {
                                return {
                                    fact: fact,
                                    operator: 'notEqual',
                                    value: question.showCondition.if[fact],
                                };
                            }),
                        },
                        ...Object.keys(question.showCondition.if).map(fact => ({
                            fact: fact,
                            operator: 'notEqual',
                            value: '',
                        })),
                    ],
                },
            ],
        };
    }

    function calculateRules(groups: GroupDomain[]) {
        const rules: RuleProperties[] = [];

        groups.forEach((group, i) => {
            if (group.questions.length === 0) return;

            group.questions.forEach((question, i) => {
                if (question.showCondition) {
                    rules.push({
                        conditions: calculateFromShowConditions(question.showCondition),
                        event: {
                            type: 'showQuestion',
                            params: {
                                id: question.id,
                            },
                        },
                    });
                } else if (i == 0) {
                    rules.push({
                        conditions: {all: []},
                        event: {
                            type: 'showQuestion',
                            params: {
                                id: question.id,
                            },
                        },
                    });
                } else {
                    rules.push({
                        conditions: calculateFromPreviousQuestion(group.questions[i - 1]),
                        event: {
                            type: 'showQuestion',
                            params: {
                                id: question.id,
                            },
                        },
                    });
                }
            });

            rules.push({
                conditions: {
                    all: group.questions.map(question => {
                        if (question.showCondition) {
                            return {
                                any: [
                                    {
                                        fact: question.id,
                                        operator: 'notEqual',
                                        value: '',
                                    },
                                    {
                                        all: Object.keys(question.showCondition.if).map(key => ({
                                            fact: key,
                                            operator: 'notEqual',
                                            value: question.showCondition.if[key],
                                        })),
                                    },
                                ],
                            };
                        }

                        return {
                            fact: question.id,
                            operator: 'notEqual',
                            value: '',
                        };
                    }),
                },
                event: {
                    type: i < groups.length - 1 ? 'nextGroup' : 'showReview',
                },
            });
        });
        return rules;
    }

    function updateQuestionOrder(groups: GroupDomain[]) {
        return groups.map(group => {
            const sequentialQuestions: Question[] = [];
            const subordinateQuestions: Question[] = [];

            group.questions.forEach(question => {
                if (question.showCondition) {
                    subordinateQuestions.push(question);
                } else {
                    sequentialQuestions.push(question);
                }
            });

            return {
                ...group,
                questions: [...sequentialQuestions, ...subordinateQuestions],
            };
        });
    }


    function handleAddQuestion(question: Question, groupName: string) {
        setFormFetchData(oldForm => {
            const updatedGroups = oldForm.groups.map(group => {
                if (group.name === groupName) {
                    group.questions.push(question);
                }
                return group;
            })

            const reorderedGroups = updateQuestionOrder(updatedGroups);
            const newRules = calculateRules(reorderedGroups);

            return {
                ...oldForm,
                groups: reorderedGroups,
                rules: newRules,
            };
        });
    }

    function handleUpdateQuestion(
        id: string,
        text: string,
        type: string,
        options: string[] | null,
        showCondition?: ShowCondition,
        parentQuestionId?: string | null
    ) {
        setFormFetchData(oldForm => {
            const newQuestion: Question = { id, text, type, options, showCondition };
            console.log('handleUpdateQuestion:', newQuestion);

            const updatedGroups = oldForm.groups.map(group => {
                const newQuestions = [...group.questions];
                const questionIndex = newQuestions.findIndex(q => q.id === id);

                if (questionIndex !== -1) {
                    const existingQuestion = newQuestions[questionIndex];
                    const wasSubordinate = !!existingQuestion.showCondition;
                    const isSubordinate = !!showCondition;

                    if (wasSubordinate && isSubordinate) {
                        newQuestions[questionIndex] = newQuestion;
                    } else if (!wasSubordinate && !isSubordinate) {
                        newQuestions[questionIndex] = newQuestion;
                    } else if (!wasSubordinate && isSubordinate) {
                        newQuestions.splice(questionIndex, 1);
                        newQuestions.push(newQuestion);
                    } else if (wasSubordinate && !isSubordinate) {
                        newQuestions.splice(questionIndex, 1);
                        newQuestions.unshift(newQuestion);
                    }
                } else if (showCondition && parentQuestionId) {
                    newQuestions.push(newQuestion);
                } else {
                    newQuestions.unshift(newQuestion);
                }

                return { ...group, questions: newQuestions };
            });

            const reorderedGroups = updateQuestionOrder(updatedGroups);
            const newRules = calculateRules(reorderedGroups);

            return {
                ...oldForm,
                groups: reorderedGroups,
                rules: newRules,
            };
        });
    }


    function handleDrop(questionID: string, groupName: string, index: number) {
        const subQuestions = formFetchData.groups.flatMap(group => group.questions).filter(q => q?.showCondition?.if?.[questionID]);
        const currentGroup = formFetchData.groups.find(group => group.questions.some(q => q.id === questionID));
        const targetGroup = formFetchData.groups.find(group => group.name === groupName);

        if (subQuestions.length > 0  && currentGroup !== targetGroup) {
            setDropError({id: questionID, msg: 'Não pode mover entre grupos uma questão que tem subquestões.' })
            return
        }

        setFormFetchData(oldForm => {
            console.log(questionID, groupName, index);
            let draggedQuestion: Question = null;
            let subQuestions: Question[] = [];

            const updatedGroups = oldForm.groups.map(group => {
                // Remove the dragged question and its subordinates from their original position
                if (group.questions.some(q => q.id === questionID)) {
                    draggedQuestion = group.questions.find(q => q.id === questionID);
                    subQuestions = group.questions.filter(q => q.showCondition?.if?.[draggedQuestion.id]);
                    group.questions = group.questions.filter(
                        q => q.id !== questionID && !subQuestions.some(subQ => subQ.id === q.id)
                    );
                }
                return group;
            });

            updatedGroups.forEach(group => {
                if (group.name === groupName) {
                    const newQuestions = [...group.questions];
                    newQuestions.splice(index, 0, draggedQuestion, ...subQuestions);
                    group.questions = newQuestions;
                }
            });

            const reorderedGroups = updateQuestionOrder(updatedGroups);
            const newRules = calculateRules(reorderedGroups);

            return {
                ...oldForm,
                groups: reorderedGroups,
                rules: newRules,
            };
        });
    }


    function handleRemoveCondition(parentQuestionId: string, subQuestionId: string) {
        setFormFetchData(oldForm => {
            const updatedGroups = oldForm.groups.map(group => {
                const newQuestions = [...group.questions];
                const questionIndex = newQuestions.findIndex(q => q.id === subQuestionId);
                if (questionIndex !== -1) {
                    const updatedQuestion = {...newQuestions[questionIndex]};
                    if (updatedQuestion.showCondition && updatedQuestion.showCondition.if) {
                        const updatedShowCondition = {...updatedQuestion.showCondition};
                        delete updatedShowCondition.if[parentQuestionId];
                        if (Object.keys(updatedShowCondition.if).length === 0) {
                            updatedQuestion.showCondition = undefined;
                        } else {
                            updatedQuestion.showCondition = updatedShowCondition;
                        }
                    }
                    newQuestions[questionIndex] = updatedQuestion;
                }
                return {...group, questions: newQuestions};
            });

            const reorderedGroups = updateQuestionOrder(updatedGroups);
            const newRules = calculateRules(reorderedGroups);
            return {...oldForm, groups: reorderedGroups, rules: newRules};
        });
    }

    function handleDeleteQuestion(question: Question, isSubQuestion: boolean = false, parentQuestionId: string | null = null) {
        if (isSubQuestion && parentQuestionId) {
            handleReassignSubQuestion(question, parentQuestionId);
        } else {
            setFormFetchData(oldForm => {
                const updatedGroups = oldForm.groups.map(group => {
                    const newQuestions = group.questions.filter(q => q.id !== question.id);
                    return {...group, questions: newQuestions};
                });

                const reorderedGroups = updateQuestionOrder(updatedGroups);
                console.log(reorderedGroups);
                return {
                    groups: reorderedGroups,
                    rules: calculateRules(reorderedGroups),
                };
            });
        }
    }

    function handleReassignSubQuestion(subQuestion: Question, parentQuestionId: string) {
        setFormFetchData(oldForm => {
            const updatedGroups = oldForm.groups.map(group => {
                if (group.questions.some(q => q.id === parentQuestionId)) {
                    const newQuestions = [...group.questions].filter(q => q.id !== subQuestion.id);
                    const updatedSubQuestion: Question = {...subQuestion, showCondition: undefined};
                    newQuestions.push(updatedSubQuestion);
                    return {...group, questions: newQuestions};
                }
                return group;
            });

            const reorderedGroups = updateQuestionOrder(updatedGroups);
            const newRules = calculateRules(reorderedGroups);
            console.log(reorderedGroups);

            return {
                ...oldForm,
                groups: reorderedGroups,
                rules: newRules,
            };
        });
    }


    function moveGroup(oldIndex: number, newIndex: number) {
        setFormFetchData(oldForm => {
            const groups = [...oldForm.groups];
            const [movedGroup] = groups.splice(oldIndex, 1);
            groups.splice(newIndex, 0, movedGroup);
            const reorderedGroups = updateQuestionOrder(groups);
            const newRules = calculateRules(reorderedGroups);
            return {...oldForm, groups: reorderedGroups, rules: newRules};
        });
    }

    function deleteGroup(group: GroupDomain) {
        setFormFetchData(oldForm => {
            const groups = oldForm.groups.slice();
            const index = groups.indexOf(group);
            groups.splice(index, 1);
            const insertIndex = index === groups.length ? index - 1 : index;

            if (groups.length !== 0) groups[insertIndex].questions.push(...oldForm.groups[index].questions);
            const reorderedGroups = updateQuestionOrder(groups);
            return {groups: reorderedGroups, rules: calculateRules(reorderedGroups)};
        });
    }

    function saveForm() {
        FormServices.saveForm(formFetchData).then(res => {
            if (res) nav('/');
        });
    }

    return {
        isLoading,
        editingQuestion,
        editingSubQuestion,
        deletingQuestion,
        creatingQuestion,
        editingGroup,
        deletingGroup,
        creatingGroup,
        creatingQuestionInGroup,
        error,
        dropError,
        formFetchData,
        calculateRules,
        setFormFetchData,
        setEditingQuestion,
        setEditingSubQuestion,
        setDeletingQuestion,
        setCreatingQuestion,
        setEditingGroup,
        setDeletingGroup,
        setCreatingGroup,
        setCreatingQuestionInGroup,
        setError,
        setDropError,
        handleDrop,
        handleRemoveCondition,
        handleDeleteQuestion,
        handleUpdateQuestion,
        handleAddQuestion,
        moveGroup,
        deleteGroup,
        saveForm,
    };
}
