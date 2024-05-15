import React, { useEffect, useState } from 'react';
import { handleError, handleRequest } from '../../services/utils/fetch';
import { useNavigate } from 'react-router-dom';
import { Form, Question } from '../../domain/Form/Form';
import { FormServices } from '../../services/from/FormServices';
import { Group } from './Group';
import { Button } from '@mui/material';
import { QuestionEditDialog } from './QuestionEditDialog';

export function Backoffice() {
  const [isLoading, setIsLoading] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState<Question>(null);
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

  const handleDrop = (questionID: string, groupName: string, index: number) => {
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
  };

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
            {formFetchData.groups.map(group => (
              <Group
                group={group}
                onDrop={handleDrop}
                onEditRequest={question => setEditingQuestion(question)}
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
            <Button onClick={saveForm}>Save Form</Button>
          </div>
        )}
      </div>
    </div>
  );
}
