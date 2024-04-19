import React, { JSX, useEffect, useState } from 'react';
import '../../App.css';
import Typography from '@mui/material/Typography';
import { Paper } from '@mui/material';
import { BooleanButtons, DefaultQuestionType, EditButton, TextInput } from './Inputs';
import { UserInfo } from './DadorInfo';
import { getForm } from '../../services/from/FormServices';
import { handleRequest } from '../../services/utils/fetch';
import { Engine } from 'json-rules-engine';
import { Form } from '../../domain/Form/Form';

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

export const form: Form = {
  questions: [
    {
      id: 'hasTraveled',
      text: 'Ja viajou para fora de Portugal?',
      type: 'boolean',
      options: null,
    },
    {
      id: 'traveledWhere',
      text: 'Para onde?',
      type: 'text',
      options: null,
    },
  ],
  rules: [
    {
      conditions: {
        any: [],
      },
      event: {
        type: 'showQuestion',
        params: {
          id: 'hasTraveled',
        },
      },
    },
    {
      conditions: {
        any: [
          {
            fact: 'hasTraveled',
            operator: 'equal',
            value: 'yes',
          },
        ],
      },
      event: {
        type: 'showQuestion',
        params: {
          id: 'traveledWhere',
        },
      },
    },
  ],
};

/**
 * Form harcoded with questions and rules
 *
 * User name and nic hardcoded
 */

export default function RealForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<Form>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<string, boolean>>({});
  const [showQuestions, setShowQuestions] = useState<Record<string, boolean>>({});
  const [engine] = useState(new Engine());

  // const [error, setError] = useState< string | null>(null);
  // const nav = useNavigate();

  useEffect(() => {
    const fetchForm = async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [error, res] = await handleRequest<Form>(getForm());
      if (error) {
        //handleError(error, setError, nav);
        return;
      }
      //setFormData(res);
      setFormData(form);
      setIsLoading(false);
    };

    if (isLoading) fetchForm(); //.then(res => console.log('Fetched', res));
  }, [isLoading, engine]);

  useEffect(() => {
    if (!formData) return;
    console.log('Form Data1:', formData.rules);
    console.log('Real form Data1:', form.rules);

    formData.rules.forEach(rule => {
      engine.addRule(rule);
    });

    console.log('Form Data2:', formData);

    setShowQuestions({});
    engine.run(formData).then(result => {
      result.results.forEach(result => {
        if (result.event.type === 'showQuestion') {
          setShowQuestions(current => ({
            ...current,
            [result.event.params.id]: true,
          }));
        }
      });
    });
  }, [formData, engine]);

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
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          formData.questions.map(question => {
            //console.log('Question:', question);
            let input: JSX.Element;
            switch (question.type) {
              case 'boolean':
                input = BooleanButtons(answer => onChangeAnswer(question.id, answer ? 'yes' : 'no'));
                break;
              case 'text':
                input = TextInput(question.id, answer => onChangeAnswer(question.id, answer));
                break;
              default:
                input = DefaultQuestionType();
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
                  <Question text={question.text} color={'red' /*question.color[question.id]*/} />
                  {answeredQuestions[question.id] ? (
                    <EditButton onChangeAnswer={() => onEditRequest(question.id)} />
                  ) : (
                    <div style={{ marginTop: '20px', justifyContent: 'space-between' }}>{input}</div>
                  )}
                </div>
              )
            );
          })
        )}
      </div>
    </div>
  );
}
