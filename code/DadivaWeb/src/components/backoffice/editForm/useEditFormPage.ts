import { useState, useEffect } from 'react';
import { handleError, handleRequest } from '../../../services/utils/fetch';
import { useNavigate } from 'react-router-dom';
import { Form, Group as GroupDomain, Question, ShowCondition } from '../../../domain/Form/Form';
import { FormServices } from '../../../services/from/FormServices';
import { RuleProperties, TopLevelCondition } from 'json-rules-engine';

export function useEditFormPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState<Question>(null);
  const [deletingQuestion, setDeletingQuestion] = useState<Question>(null);
  const [creatingQuestion, setCreatingQuestion] = useState(false);

  const [editingGroup, setEditingGroup] = useState<GroupDomain>(null);
  const [deletingGroup, setDeletingGroup] = useState<GroupDomain>(null);
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [creatingQuestionInGroup, setCreatingQuestionInGroup] = useState<GroupDomain>(null);

  const nav = useNavigate();
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
    return groups.map(group => {
      const newQuestions = [...group.questions];
      const reorderedQuestions: Question[] = [];

      newQuestions.forEach(question => {
        if (!reorderedQuestions.some(q => q.id === question.id)) {
          reorderedQuestions.push(question);
          const subQuestions = newQuestions.filter(subQ => subQ.showCondition?.if?.[question.id]);
          reorderedQuestions.push(...subQuestions);
        }
      });

      return {
        ...group,
        questions: reorderedQuestions,
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

      const updatedGroups = oldForm.groups.map(group => {
        if (group.questions.some(q => q.id === id)) {
          const newQuestions = group.questions.filter(q => q.id !== id);
          if (parentQuestionId) {
            const parentIndex = newQuestions.findIndex(q => q.id === parentQuestionId);
            newQuestions.splice(parentIndex + 1, 0, newQuestion);
          } else {
            newQuestions.push(newQuestion);
          }
          return { ...group, questions: newQuestions };
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

  function handleDrop(questionID: string, groupName: string, index: number) {
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

      // Insert the dragged question and its subordinates into the new position
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

  function handleDeleteQuestion(question: Question) {
    setFormFetchData(oldForm => {
      const newGroups = oldForm.groups.map(group => ({
        name: group.name,
        questions: group.questions.filter(q => q.id !== question.id),
      }));
      const reorderedGroups = updateQuestionOrder(newGroups);
      return {
        groups: reorderedGroups,
        rules: calculateRules(reorderedGroups),
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
      return { ...oldForm, groups: reorderedGroups, rules: newRules };
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
      return { groups: reorderedGroups, rules: calculateRules(reorderedGroups) };
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
    deletingQuestion,
    creatingQuestion,
    editingGroup,
    deletingGroup,
    creatingGroup,
    creatingQuestionInGroup,
    error,
    formFetchData,
    calculateRules,
    setFormFetchData,
    setEditingQuestion,
    setDeletingQuestion,
    setCreatingQuestion,
    setEditingGroup,
    setDeletingGroup,
    setCreatingGroup,
    setCreatingQuestionInGroup,
    setError,
    handleDrop,
    handleDeleteQuestion,
    handleUpdateQuestion,
    moveGroup,
    deleteGroup,
    saveForm,
  };
}
