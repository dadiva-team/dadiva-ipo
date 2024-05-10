import React, { useEffect, useState } from 'react';
import { handleError, handleRequest } from '../../services/utils/fetch';
//import { getForm } from '../../services/from/FormServices';
import { useNavigate } from 'react-router-dom';
import { Form, Question } from '../../domain/Form/Form';
import { FormServices } from '../../services/from/FormServices';
import { Group } from './Group';
import { Button } from '@mui/material';

export function Backoffice() {
  const [isLoading, setIsLoading] = useState(true);
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

  const handleDrop = (questionID: string, groupName: string) => {
    setFormFetchData(oldForm => {
      const form = new Form();

      let newQuestion: Question = null;

      form.groups = oldForm.groups.map(group => {
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
      });

      form.groups = form.groups.map(group => {
        if (group.name === groupName) {
          return { name: group.name, questions: [...group.questions, newQuestion] };
        }
        return group;
      });

      form.rules = oldForm.rules;
      return form;
    });
  };

  function saveForm() {
    FormServices.saveForm(formFetchData);
  }

  return (
    <div>
      {
        <div>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div>
              {formFetchData.groups.map(group => {
                return <Group group={group} onDrop={handleDrop} key={group.name} />;
              })}
            </div>
          )}
        </div>
      }
      <Button onClick={saveForm}>Save Form</Button>
    </div>
  );
}
