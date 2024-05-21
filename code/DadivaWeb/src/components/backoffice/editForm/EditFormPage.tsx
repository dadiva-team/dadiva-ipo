import React, { useEffect, useState } from 'react';
import { handleError, handleRequest } from '../../../services/utils/fetch';
import { useNavigate } from 'react-router-dom';
import { Form, Group as GroupDomain, Question, ShowCondition } from '../../../domain/Form/Form';
import { FormServices } from '../../../services/from/FormServices';
import { Group } from './Group';
import { Button } from '@mui/material';
import { QuestionEditDialog } from './QuestionEditDialog';
import { QuestionAddDialog } from './QuestionAddDialog';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { form } from '../../form/MockForm';
import { DeleteGroupDialog } from './DeleteGroupDialog';
import { DeleteQuestionDialog } from './DeleteQuestionDialog';
import { GroupAddDialog } from './GroupAddDialog';
import { GroupEditDialog } from './GroupEditDialog';
import { RuleProperties, TopLevelCondition } from 'json-rules-engine';

export function EditFormPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState<Question>(null);
  const [deletingQuestion, setDeletingQuestion] = useState<Question>(null);
  const [creatingQuestion, setCreatingQuestion] = useState(false);

  const [editingGroup, setEditingGroup] = useState<GroupDomain>(null);
  const [deletingGroup, setDeletingGroup] = useState<GroupDomain>(null);
  const [creatingGroup, setCreatingGroup] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setError] = React.useState<string | null>(null);
  const nav = useNavigate();
  const [formFetchData, setFormFetchData] = useState<Form>();

  useEffect(() => {
    const fetch = async () => {
      // eslint-disable-next-line prefer-const
      let [error, res] = await handleRequest(FormServices.getForm());
      if (error) {
        handleError(error, setError, nav);
        return;
      }
      //Mock Form for Testing
      //res = form;
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

      // show question
      group.questions.forEach((question, i) => {
        console.log(question.id, !!question.showCondition, i == 0);
        if (question.showCondition) {
          console.log(question.showCondition);
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

      // Next group and show Review
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

  function handleDrop(questionID: string, groupName: string, index: number) {
    setFormFetchData(oldForm => {
      let newQuestion: Question = null;
      const newGroups = oldForm.groups
        .map(group => {
          return {
            name: group.name,
            questions: group.questions.filter(q => {
              if (q.id === questionID) {
                newQuestion = q;
                return false;
              }
              return true;
            }),
          };
        })
        .map(group => {
          if (group.name === groupName) {
            const newQuestions = [...group.questions];
            newQuestions.splice(index, 0, newQuestion);
            return { name: group.name, questions: newQuestions };
          }
          return group;
        });

      const newRules = calculateRules(newGroups);

      const form: Form = {
        groups: newGroups,
        rules: newRules,
      };

      console.log(form);
      return form;
    });
  }

  function handleDeleteQuestion(question: Question) {
    setFormFetchData(oldForm => {
      const newGroups = oldForm.groups.map(group => ({
        name: group.name,
        questions: group.questions.filter(q => q.id !== question.id),
      }));
      return {
        groups: newGroups,
        rules: calculateRules(newGroups),
      };
    });
  }

  function moveGroup(oldIndex: number, newIndex: number) {
    setFormFetchData(oldForm => {
      const groups = [...oldForm.groups];
      const [movedGroup] = groups.splice(oldIndex, 1);
      groups.splice(newIndex, 0, movedGroup);
      return { ...oldForm, groups };
    });
  }

  function deleteGroup(group: GroupDomain) {
    setFormFetchData(oldForm => {
      const groups = oldForm.groups.slice();
      const index = groups.indexOf(group);
      groups.splice(index, 1);
      const insertIndex = index === groups.length ? index - 1 : index;

      if (groups.length !== 0) groups[insertIndex].questions.push(...oldForm.groups[index].questions);
      return { groups: groups, rules: calculateRules(groups) };
    });
  }

  function saveForm() {
    FormServices.saveForm(formFetchData).then(res => {
      if (res) nav('/');
    });

    //Mock Form for Testing
    //form.groups = formFetchData.groups;
  }

  return (
    <div>
      <div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div>
            <Button disabled={formFetchData.groups.length === 0} onClick={() => setCreatingQuestion(true)}>
              Criar Questão
            </Button>
            <Button onClick={() => setCreatingGroup(true)}>Criar Grupo</Button>
            {formFetchData.groups.map((group, index) => (
              <Group
                group={group}
                onDrop={handleDrop}
                onEditRequest={question => setEditingQuestion(question)}
                onDeleteRequest={question => setDeletingQuestion(question)}
                onMoveUp={index === 0 ? null : () => moveGroup(index, index - 1)}
                onMoveDown={index === formFetchData.groups.length - 1 ? null : () => moveGroup(index, index + 1)}
                onRename={() => setEditingGroup(group)}
                onDelete={formFetchData.groups.length === 1 ? null : () => setDeletingGroup(group)}
                key={group.name}
              />
            ))}
            <QuestionEditDialog
              open={editingQuestion !== null}
              question={editingQuestion}
              questions={formFetchData.groups
                .find(group => group.questions.includes(editingQuestion))
                ?.questions.filter(q => q.id != editingQuestion.id)}
              onAnswer={(id, text, type, options, showCondition) => {
                console.log({ id, text, type, options, showCondition } as Question);
                setFormFetchData((oldForm: Form) => {
                  const newGroups = oldForm.groups.map(group => ({
                    name: group.name,
                    questions: group.questions.map(question =>
                      question.id === id ? ({ id, text, type, options, showCondition } as Question) : question
                    ),
                  }));
                  return {
                    groups: newGroups,
                    rules: calculateRules(newGroups),
                  };
                });
              }}
              onClose={() => setEditingQuestion(null)}
              isFirst={formFetchData.groups.some(group => group.questions.indexOf(editingQuestion) > 0)}
            />
            <QuestionAddDialog
              open={creatingQuestion}
              groups={formFetchData.groups.map(group => group.name)}
              onAnswer={(question, groupName) => {
                setFormFetchData((oldForm: Form) => {
                  const newGroups = oldForm.groups.map(group => {
                    if (group.name === groupName) {
                      return { name: group.name, questions: [...(group.questions ?? []), question] };
                    }
                    return group;
                  });
                  return {
                    groups: newGroups,
                    rules: calculateRules(newGroups),
                  };
                });
              }}
              onClose={() => setCreatingQuestion(false)}
            />
            <DeleteQuestionDialog
              open={deletingQuestion !== null}
              questionText={deletingQuestion?.text}
              onAnswer={del => {
                if (!del) return;

                handleDeleteQuestion(deletingQuestion);
              }}
              onClose={() => setDeletingQuestion(null)}
            />
            <GroupEditDialog
              open={editingGroup !== null}
              group={editingGroup}
              onAnswer={(newName: string) => {
                setFormFetchData((oldForm: Form) => {
                  const newGroups = oldForm.groups.map(group => {
                    if (group.name === editingGroup.name) return { name: newName, questions: group.questions };
                    return group;
                  });
                  return {
                    groups: newGroups,
                    rules: calculateRules(newGroups),
                  };
                });
              }}
              onClose={() => setEditingGroup(null)}
            />
            <GroupAddDialog
              open={creatingGroup}
              onAnswer={groupName => {
                setFormFetchData((oldForm: Form) => {
                  const newGroups = [...oldForm.groups, { name: groupName, questions: [] }];
                  return {
                    groups: newGroups,
                    rules: calculateRules(newGroups),
                  };
                });
              }}
              onClose={() => setCreatingGroup(false)}
            />
            <DeleteGroupDialog
              open={deletingGroup !== null}
              groupName={deletingGroup?.name}
              onAnswer={del => {
                if (!del) return;
                deleteGroup(deletingGroup);
              }}
              onClose={() => setDeletingGroup(null)}
            />
            <Button disabled={!formFetchData.groups.some(g => g.questions.length !== 0)} onClick={saveForm}>
              Guardar Formulário
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
