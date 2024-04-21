import React, { JSX, useEffect, useState } from 'react';
import '../../App.css';
import Typography from '@mui/material/Typography';
import { Paper } from '@mui/material';
import { BooleanButtons, DefaultQuestionType, EditButton, TextInput } from './Inputs';
import { UserInfo } from './DadorInfo';
import { Engine } from 'json-rules-engine';
import { Form } from '../../domain/Form/Form';
import { handleRequest } from '../../services/utils/fetch';
import { getForm } from '../../services/from/FormServices';

type QuestionProps = {
  text: string;
  color: string;
};

function Question({ text, color }: QuestionProps) {
  return (
    <Paper elevation={4} sx={{ padding: 2, maxWidth: 500, my: 2, bgcolor: color }}>
      <Typography variant="body1" component="div" sx={{ marginTop: 1 }}>
        {text}
      </Typography>
    </Paper>
  );
}

export default function RealForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<string, boolean>>({});
  const [showQuestions, setShowQuestions] = useState<Record<string, boolean>>();
  const [engine] = useState(new Engine());

  const [formFetchData, setFormFetchData] = useState<Form>();

  useEffect(() => {
    const fetch = async () => {
      const [error, res] = await handleRequest(getForm());
      if (error) {
        console.error('Error fetching form data:', error);
        return;
      }

      setFormFetchData(res as Form);
      setFormData(Object.fromEntries(res.questions.map(question => [question.id, ''])));
      setAnsweredQuestions(Object.fromEntries(res.questions.map(question => [question.id, false])));

      res.questions.forEach(question => {
        engine.addFact(question.id, () => formData[question.id]);
      });
      res.rules.forEach(rule => {
        engine.addRule(rule);
      });

      setIsLoading(false);
    };

    if (isLoading) {
      fetch();
    }
  }, [engine, formData, formFetchData, isLoading]);

  useEffect(() => {
    if (!formData && !formFetchData) return;

    setShowQuestions({});
    engine.run(formData).then(result => {
      result.results.forEach(result => {
        if (result.event.type === 'showQuestion') {
          setShowQuestions(current => {
            return {
              ...current,
              [result.event.params.id]: true,
            };
          });
        }
      });
    });
  }, [engine, formData, formFetchData]);

  function onChangeAnswer(questionId: string, answer: string) {
    setFormData({
      ...formData,
      [questionId]: answer,
    });
    setAnsweredQuestions({
      ...answeredQuestions,
      [questionId]: true,
    });
  }

  function onEditRequest(questionId: string) {
    console.log('Edit Requested on question: ' + questionId);
    setAnsweredQuestions({
      ...answeredQuestions,
      [questionId]: false,
    });
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <img className="logo" src={'/IPO-logo.png'} alt={'IPO logo'} />
        <UserInfo name="Pedro" nic="123456789" />
      </div>
      <div>
        {
          <div>
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <div>
                {formFetchData?.questions.map(question => {
                  let input: JSX.Element;
                  switch (question.type) {
                    case 'boolean':
                      input = (
                        <BooleanButtons onChangeAnswer={answer => onChangeAnswer(question.id, answer ? 'yes' : 'no')} />
                      );
                      break;
                    case 'text':
                      input = <TextInput onChangeAnswer={answer => onChangeAnswer(question.id, answer)} />;
                      break;
                    default:
                      input = <DefaultQuestionType />;
                      break;
                  }
                  return (
                    showQuestions &&
                    showQuestions[question.id] && (
                      <div
                        key={question.id}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Question text={question.text} color={'red'} />
                        {answeredQuestions[question.id] ? (
                          <EditButton onChangeAnswer={() => onEditRequest(question.id)} />
                        ) : (
                          <div style={{ marginTop: '20px', justifyContent: 'space-between' }}>{input}</div>
                        )}
                      </div>
                    )
                  );
                })}
              </div>
            )}
          </div>
        }
      </div>
    </div>
  );
}
