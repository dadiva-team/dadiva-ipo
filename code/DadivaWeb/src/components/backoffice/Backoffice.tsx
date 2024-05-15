import React, { useEffect, useState } from 'react';
import { handleError, handleRequest } from '../../services/utils/fetch';
import { useNavigate } from 'react-router-dom';
import { Form, Question } from '../../domain/Form/Form';
import { FormServices } from '../../services/from/FormServices';
import { Group } from './Group';
import { Button } from '@mui/material';
import { QuestionEditDialog } from './QuestionEditDialog';
import { QuestionAddDialog } from './QuestionAddDialog';

export function Backoffice() {
  const [isLoading, setIsLoading] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState<Question>(null);
  const [creatingQuestion, setCreatingQuestion] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setError] = React.useState<string | null>(null);
  const nav = useNavigate();
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

  function saveForm() {
    FormServices.saveForm(formFetchData).then(() => {
      nav('/');
    });
  }

  return (
    <div>
      <div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div>
            <Button disabled={formFetchData.groups.length === 0} onClick={() => setCreatingQuestion(true)}>
              Create Question
            </Button>
            {formFetchData.groups.map(group => (
              <Group
                group={group}
                onDrop={handleDrop}
                onEditRequest={question => setEditingQuestion(question)}
                onDeleteRequest={question => handleDeleteQuestion(question)}
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
            <Button onClick={saveForm}>Save Form</Button>
          </div>
        )}
      </div>
    </div>
  );
}
