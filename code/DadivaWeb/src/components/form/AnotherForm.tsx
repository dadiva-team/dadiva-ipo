import { Engine } from 'json-rules-engine';
import React, { JSX, useEffect, useState } from 'react';
import { BooleanButtons, DefaultQuestionType, TextInput } from './Inputs';
import { Form } from '../../domain/Form/Form';

export const form: Form = {
  questions: [
    {
      id: 'hasTraveled',
      text: 'Ja viajou para fora de Portugal?',
      type: 'boolean',
      options: null,
      //color: { yes: 'green', no: 'red' },
    },
    {
      id: 'traveledWhere',
      text: 'Para onde?',
      type: 'text',
      options: null,
      //color: { yes: 'green', no: 'red' },
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

export default function AnotherForm() {
  const [formData, setFormData] = useState<Record<string, string>>(
    Object.fromEntries(form.questions.map(question => [question.id, '']))
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
  }

  return (
    <div>
      <h1>Another Form</h1>
      <form>
        {form.questions.map(question => {
          let input: JSX.Element;
          switch (question.type) {
            case 'boolean':
              input = <BooleanButtons onChangeAnswer={answer => onChangeAnswer(question.id, answer ? 'yes' : 'no')} />;
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
              <div key={question.id}>
                <label>{question.text}</label>
                {input}
              </div>
            )
          );
        })}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
