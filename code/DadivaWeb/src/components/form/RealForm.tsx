import React, { JSX, useEffect, useState } from 'react';
import '../../App.css';
import Typography from '@mui/material/Typography';
import { Paper } from '@mui/material';
import { Form } from './AnotherForm';
import { BooleanButtons, DefaultQuestionType, EditButton, TextInput } from './Inputs';
import { Engine } from 'json-rules-engine';
import { UserInfo } from './DadorInfo';

const form: Form = {
  questions: [
    {
      id: 'hasTraveled',
      text: 'Ja viajou para fora de Portugal?',
      type: 'boolean',
      options: null,
      color: { yes: 'green', no: 'red' },
    },
    {
      id: 'traveledWhere',
      text: 'Para onde?',
      type: 'text',
      options: null,
      color: { yes: 'green', no: 'red' },
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

/**
 * Form harcoded with questions and rules
 *
 * User name and nic hardcoded
 */
export default function RealForm() {
  const [formData, setFormData] = useState<Record<string, string>>(
    Object.fromEntries(form.questions.map(question => [question.id, '']))
  );
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<string, boolean>>(
    Object.fromEntries(form.questions.map(question => [question.id, false]))
  );
  const [showQuestions, setShowQuestions] = useState<Record<string, boolean>>();
  const [engine] = useState(new Engine());

  form.rules.forEach(rule => {
    engine.addRule(rule);
  });

  useEffect(() => {
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
  }, [engine, formData]);

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
        {form.questions.map(question => {
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
                <Question text={question.text} color={question.color[formData[question.id]]} />
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
    </div>
  );
}
