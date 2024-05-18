import React, { useEffect, useState } from 'react';
import { handleError, handleRequest } from '../../services/utils/fetch';
import { useNavigate } from 'react-router-dom';
import { Form, Group as GroupDomain, Question } from '../../domain/Form/Form';
import { FormServices } from '../../services/from/FormServices';
import { Group } from './Group';
import { Button } from '@mui/material';
import { QuestionEditDialog } from './QuestionEditDialog';
import { QuestionAddDialog } from './QuestionAddDialog';
import { form } from '../form/MockForm';
import { DeleteGroupDialog } from './DeleteGroupDialog';
import { DeleteQuestionDialog } from './DeleteQuestionDialog';
import { GroupAddDialog } from './GroupAddDialog';
import { GroupEditDialog } from './GroupEditDialog';

export function Backoffice() {
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
      res = form;
      setFormFetchData(res as Form);
      setIsLoading(false);
    };

    if (isLoading) fetch();
  }, [isLoading, nav]);

  function handleDrop(questionID: string, groupName: string, index: number) {
    setFormFetchData(oldForm => {
      let newQuestion: Question = null;
      const form: Form = {
        groups: oldForm.groups
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
          }),
        rules: oldForm.rules,
      };
      return form;
    });
  }

  function handleDeleteQuestion(question: Question) {
    setFormFetchData(oldForm => {
      const form: Form = {
        groups: oldForm.groups.map(group => ({
          name: group.name,
          questions: group.questions.filter(q => q.id !== question.id),
        })),
        rules: oldForm.rules,
      };
      return form;
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
      return { groups: groups, rules: oldForm.rules };
    });
  }

  function saveForm() {
    form.groups = formFetchData.groups;
    nav('/');
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
              onAnswer={(id, text, type, options) => {
                setFormFetchData((oldForm: Form) => ({
                  groups: oldForm.groups.map(group => ({
                    name: group.name,
                    questions: group.questions.map(question =>
                      question.id === id ? ({ id, text, type, options } as Question) : question
                    ),
                  })),
                  rules: oldForm.rules,
                }));
              }}
              onClose={() => setEditingQuestion(null)}
            />
            <QuestionAddDialog
              open={creatingQuestion}
              groups={formFetchData.groups.map(group => group.name)}
              onAnswer={(question, groupName) => {
                setFormFetchData((oldForm: Form) => {
                  return {
                    groups: oldForm.groups.map(group => {
                      if (group.name === groupName) {
                        return { name: group.name, questions: [...(group.questions ?? []), question] };
                      }
                      return group;
                    }),
                    rules: oldForm.rules,
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
                setFormFetchData((oldForm: Form) => ({
                  groups: oldForm.groups.map(group => {
                    if (group.name === editingGroup.name) return { name: newName, questions: group.questions };
                    return group;
                  }),
                  rules: oldForm.rules,
                }));
              }}
              onClose={() => setEditingGroup(null)}
            />
            <GroupAddDialog
              open={creatingGroup}
              onAnswer={groupName => {
                setFormFetchData((oldForm: Form) => {
                  return {
                    groups: [...oldForm.groups, { name: groupName, questions: [] }],
                    rules: oldForm.rules,
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
