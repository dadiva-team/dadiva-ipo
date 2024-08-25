import { useEffect, useState } from 'react';
import { handleError, handleRequest } from '../../../services/utils/fetch';
import { useNavigate } from 'react-router-dom';
import { Form, Group as GroupDomain, Question, ShowCondition } from '../../../domain/Form/Form';
import { FormServices } from '../../../services/from/FormServices';
import { RuleProperties, TopLevelCondition } from 'json-rules-engine';
import { Uris } from '../../../utils/navigation/Uris';
import BACKOFFICE = Uris.BACKOFFICE;
import { useTranslation } from 'react-i18next';
import { compareForms, FormChanges } from './utils';

export function useEditFormPage() {
  const { i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState<Question>(null);
  const [editingSubQuestion, setEditingSubQuestion] = useState<Question>(null);

  type DeletingQuestionState = {
    question: Question | null;
    isSubQuestion: boolean;
    parentQuestionId: string | null;
  };

  const [deletingQuestion, setDeletingQuestion] = useState<DeletingQuestionState>(null);
  const [formPlaygroundModalOpen, setFormPlaygroundModalOpen] = useState(false);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [creatingQuestion, setCreatingQuestion] = useState(false);

  const [editingGroup, setEditingGroup] = useState<GroupDomain>(null);
  const [deletingGroup, setDeletingGroup] = useState<GroupDomain>(null);
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [creatingQuestionInGroup, setCreatingQuestionInGroup] = useState<string>(null);
  const [formChanges, setFormChanges] = useState<FormChanges>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nav = useNavigate();
  const [dropError, setDropError] = useState<{ id: string; msg: string }>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [form, setForm] = useState<Form>();
  const [originalForm, setOriginalForm] = useState<Form | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const [error, res] = await handleRequest(FormServices.getForm(i18n.language));
      if (error) {
        handleError(error, setError, nav);
        return;
      }
      setForm(res as Form);
      setOriginalForm(res as Form);
      setIsLoading(false);
    };

    if (isLoading) fetch();
  }, [i18n.language, isLoading, nav]);

  function calculateFromShowConditions(showCondition: ShowCondition): TopLevelCondition {
    const condition: TopLevelCondition = { all: [] };

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
            conditions: { all: [] },
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
    return groups;
    /*
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
    */
  }

  function handleAddQuestion(question: Question, groupName: string) {
    setForm(oldForm => {
      const updatedGroups = oldForm.groups.map(group => {
        if (group.name === groupName) {
          group.questions.push(question);
        }
        return group;
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

  function handleUpdateQuestion(
    id: string,
    text: string,
    type: string,
    options: string[] | null,
    showCondition?: ShowCondition,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    parentQuestionId?: string | null
  ) {
    setForm(oldForm => {
      const newQuestion: Question = { id, text, type, options, showCondition };
      console.log('handleUpdateQuestion:', newQuestion);

      const updatedGroups = oldForm.groups.map(group => {
        const newQuestions = [...group.questions];
        const questionIndex = newQuestions.findIndex(q => q.id === id);
        if (questionIndex === -1) return group;

        if (showCondition) {
          newQuestions.splice(questionIndex, 1);

          const parentIds: string[] = Object.keys(showCondition.if);
          const parentIndexes: number[] = parentIds.map(fact => newQuestions.findIndex(q => q.id === fact));
          const greatestParentIndex = Math.max(...parentIndexes);
          newQuestions.splice(greatestParentIndex + 1, 0, newQuestion);
          return { name: group.name, questions: newQuestions };
        } else {
          newQuestions[questionIndex] = newQuestion;
          return { name: group.name, questions: newQuestions };
        }
      });
      const newRules = calculateRules(updatedGroups);

      return {
        groups: updatedGroups,
        rules: newRules,
        language: oldForm.language,
      };
    });
  }

  function handleDrop(questionID: string, groupName: string, index: number) {
    setForm(oldForm => {
      console.log('handleDrop:', questionID, groupName, index);
      const subQuestionsIds = oldForm.groups
        .flatMap(group => group.questions)
        .filter(q => q?.showCondition?.if !== null && q?.showCondition?.if !== undefined)
        .map(q => q.id);
      console.log('subQuestionsIds:', subQuestionsIds);
      if (subQuestionsIds.includes(questionID)) {
        // Shouldn't happen, but just in case
        console.log('Cannot move a sub-question');
        setDropError({ id: questionID, msg: 'Não pode mover uma sub-questão' });
        return;
      }
      let newIndex = index;

      if (subQuestionsIds.length !== 0) {
        const subQuestionsIndexes = subQuestionsIds.map(subQuestionId => {
          return oldForm.groups
            .find(group => group.questions.some(q => q.id === subQuestionId))
            .questions.findIndex(q => q.id === subQuestionId);
        });
        console.log('oldIndex', newIndex);
        console.log('subQuestionsIndexes', subQuestionsIndexes);
        if (subQuestionsIndexes.some(idx => idx === newIndex)) {
          newIndex++;
          console.log('newIndex', newIndex);
        }
      }

      const childQuestions: Question[] = [];
      let isParentQuestion = false;
      oldForm.groups.forEach(group => {
        group.questions.forEach(question => {
          if (question.showCondition?.if[questionID]) {
            isParentQuestion = true;
            childQuestions.push(question);
          }
        });
      });

      const newGroups = oldForm.groups.map(group => {
        if (group.name !== groupName) return group;
        const newQuestions = [...group.questions];

        if (isParentQuestion) {
          const parentIndex = newQuestions.findIndex(q => q.id === questionID);
          console.log('Parent going from ', parentIndex, 'to ', newIndex);
          newQuestions.splice(newIndex, 0, newQuestions.splice(parentIndex, 1)[0]);

          childQuestions.forEach(childQuestion => {
            const childIndex = newQuestions.findIndex(q => q.id === childQuestion.id);
            const parentIndexes = Object.keys(childQuestion.showCondition.if).map(fact => {
              console.log(newQuestions);
              const myParentIndex = newQuestions.findIndex(q => q.id === fact);
              console.log('q.id: ', newQuestions[myParentIndex].id);
              console.log('Fact: ', fact);
              console.log('idx: ', myParentIndex);
              console.log(newQuestions);
              return myParentIndex;
            });
            const greatestParentIndex = Math.max(...parentIndexes);
            console.log('Child going from ', childIndex, 'to ', greatestParentIndex + 1);
            newQuestions.splice(greatestParentIndex + 1, 0, newQuestions.splice(childIndex, 1)[0]);
          });
        } else {
          const currIndex = newQuestions.findIndex(q => q.id === questionID);
          newQuestions.splice(newIndex, 0, newQuestions.splice(currIndex, 1)[0]);
        }
        return { name: group.name, questions: newQuestions };
      });
      return {
        groups: newGroups,
        rules: calculateRules(newGroups),
        language: oldForm.language,
      };
    });
  }

  function handleRemoveCondition(parentQuestionId: string, subQuestionId: string) {
    setForm(oldForm => {
      const updatedGroups = oldForm.groups.map(group => {
        const newQuestions = [...group.questions];
        const questionIndex = newQuestions.findIndex(q => q.id === subQuestionId);
        if (questionIndex !== -1) {
          const updatedQuestion = { ...newQuestions[questionIndex] };
          if (updatedQuestion.showCondition && updatedQuestion.showCondition.if) {
            const updatedShowCondition = { ...updatedQuestion.showCondition };
            delete updatedShowCondition.if[parentQuestionId];
            if (Object.keys(updatedShowCondition.if).length === 0) {
              updatedQuestion.showCondition = undefined;
            } else {
              updatedQuestion.showCondition = updatedShowCondition;
            }
          }
          newQuestions[questionIndex] = updatedQuestion;
        }
        return { ...group, questions: newQuestions };
      });

      const reorderedGroups = updateQuestionOrder(updatedGroups);
      const newRules = calculateRules(reorderedGroups);
      return { ...oldForm, groups: reorderedGroups, rules: newRules };
    });
  }

  function handleDeleteQuestion(
    question: Question,
    isSubQuestion: boolean = false,
    parentQuestionId: string | null = null
  ) {
    if (isSubQuestion && parentQuestionId) {
      handleReassignSubQuestion(question, parentQuestionId);
    } else {
      setForm(oldForm => {
        const updatedGroups = oldForm.groups.map(group => {
          const newQuestions = group.questions.filter(q => q.id !== question.id);
          return { ...group, questions: newQuestions };
        });

        const reorderedGroups = updateQuestionOrder(updatedGroups);
        console.log(reorderedGroups);
        return {
          groups: reorderedGroups,
          rules: calculateRules(reorderedGroups),
          language: oldForm.language,
        };
      });
    }
  }

  function handleReassignSubQuestion(subQuestion: Question, parentQuestionId: string) {
    setForm(oldForm => {
      const updatedGroups = oldForm.groups.map(group => {
        if (group.questions.some(q => q.id === parentQuestionId)) {
          const newQuestions = [...group.questions].filter(q => q.id !== subQuestion.id);
          const updatedSubQuestion: Question = { ...subQuestion, showCondition: undefined };
          newQuestions.push(updatedSubQuestion);
          return { ...group, questions: newQuestions };
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
        language: oldForm.language,
      };
    });
  }

  function moveGroup(oldIndex: number, newIndex: number) {
    setForm(oldForm => {
      const groups = [...oldForm.groups];
      const [movedGroup] = groups.splice(oldIndex, 1);
      groups.splice(newIndex, 0, movedGroup);
      const reorderedGroups = updateQuestionOrder(groups);
      const newRules = calculateRules(reorderedGroups);
      return { ...oldForm, groups: reorderedGroups, rules: newRules };
    });
  }

  function deleteGroup(group: GroupDomain) {
    setForm(oldForm => {
      const groups = oldForm.groups.slice();
      const index = groups.indexOf(group);
      groups.splice(index, 1);
      const insertIndex = index === groups.length ? index - 1 : index;

      if (groups.length !== 0) groups[insertIndex].questions.push(...oldForm.groups[index].questions);
      const reorderedGroups = updateQuestionOrder(groups);
      return { groups: reorderedGroups, rules: calculateRules(reorderedGroups), language: oldForm.language };
    });
  }

  const closeModalPlayground = () => {
    setFormPlaygroundModalOpen(false);
  };

  const openModalPlayground = () => {
    setFormPlaygroundModalOpen(true);
  };

  const handleOpenSubmitDialog = () => {
    const changes = compareForms(originalForm!, form, i18n.t);
    console.log(changes);
    setFormChanges(changes);
    setSubmitDialogOpen(true);
  };

  const handleCloseSubmitDialog = () => {
    setFormChanges(null);
    setSubmitDialogOpen(false);
  };

  function handleSaveForm(reason: string) {
    setIsSubmitting(true);
    saveForm(reason).then(() => setIsSubmitting(false));
  }

  async function saveForm(reason: string) {
    const [error, res] = await handleRequest(FormServices.editForm(form, reason)); // TODO: Add submit Modal

    if (error) {
      handleError(error, setSubmitError, nav);
      return;
    }

    if (res) nav(BACKOFFICE);
  }

  return {
    isLoading,
    isSubmitting,
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
    submitError,
    form,
    calculateRules,
    setFormFetchData: setForm,
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
    formPlaygroundModalOpen,
    closeModalPlayground,
    openModalPlayground,
    submitDialogOpen,
    handleOpenSubmitDialog,
    handleCloseSubmitDialog,
    formChanges,
    handleSaveForm,
  };
}
