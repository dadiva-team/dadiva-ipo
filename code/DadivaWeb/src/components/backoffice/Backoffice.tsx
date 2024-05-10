import React, { useEffect, useState } from 'react';
import { handleError, handleRequest } from '../../services/utils/fetch';
//import { getForm } from '../../services/from/FormServices';
import { useNavigate } from 'react-router-dom';
import { Form } from '../../domain/Form/Form';
import { FormServices } from '../../services/from/FormServices';

export function Backoffice() {
  const [isLoading, setIsLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = React.useState<string | null>(null);
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
  return (
    <div>
      {
        <div>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div>
              {formFetchData.groups.map(group => {
                return (
                  <div key={group.name}>
                    <h1>{group.name}</h1>
                    {group.questions.map(question => {
                      return <div key={question.id}>{question.text}</div>;
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      }
    </div>
  );
}
