import React, { JSX, useEffect, useState } from 'react';
import '../../App.css';
import { BooleanButtons, DefaultQuestionType, EditButton, NextQuestionButton, TextInput } from './Inputs';
import { UserInfo } from './DadorInfo';
import { Engine } from 'json-rules-engine';
import { Form } from '../../domain/Form/Form';
import { handleError, handleRequest } from '../../services/utils/fetch';
import { getForm } from '../../services/from/FormServices';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../../services/utils/colors';
import { Question } from './Question';

export const form: Form = {
  questions: [
    {
      id: 'a',
      text: 'Question A',
      type: 'boolean',
      options: null,
    },
    {
      id: 'a1',
      text: 'Question A1',
      type: 'boolean',
      options: null,
    },
    {
      id: 'a2',
      text: 'Question A2',
      type: 'boolean',
      options: null,
    },
    {
      id: 'b',
      text: 'Question B',
      type: 'boolean',
      options: null,
    },
    {
      id: 'b1',
      text: 'Question B1',
      type: 'boolean',
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
          id: 'a',
          subQuestion: 'a',
        },
      },
    },
    {
      conditions: {
        any: [
          {
            fact: 'a',
            operator: 'equal',
            value: 'yes',
          },
        ],
      },
      event: {
        type: 'showQuestion',
        params: {
          id: 'a1',
          subQuestion: 'a',
        },
      },
    },
    {
      conditions: {
        any: [
          {
            fact: 'a',
            operator: 'equal',
            value: 'no',
          },
        ],
      },
      event: {
        type: 'nextQuestion',
        params: {
          id: 'b',
        },
      },
    },
    {
      conditions: {
        any: [
          {
            fact: 'a1',
            operator: 'equal',
            value: 'yes',
          },
        ],
      },
      event: {
        type: 'showQuestion',
        params: {
          id: 'a2',
          subQuestion: 'a',
        },
      },
    },
    {
      conditions: {
        any: [
          {
            fact: 'a1',
            operator: 'equal',
            value: 'no',
          },
        ],
      },
      event: {
        type: 'nextQuestion',
        params: {
          id: 'b',
        },
      },
    },
    {
      conditions: {
        any: [
          {
            fact: 'a2',
            operator: 'equal',
            value: 'yes',
          },
        ],
      },
      event: {
        type: 'nextQuestion',
        params: {
          id: 'b',
        },
      },
    },
    {
      conditions: {
        any: [
          {
            fact: 'b',
            operator: 'equal',
            value: 'yes',
          },
        ],
      },
      event: {
        type: 'showQuestion',
        params: {
          id: 'b1',
          subQuestion: 'b',
        },
      },
    },
    {
      conditions: {
        any: [
          {
            fact: 'b',
            operator: 'equal',
            value: 'no',
          },
        ],
      },
      event: {
        type: 'final question',
      },
    },
  ],
};

export default function RealForm() {
  const [isLoading, setIsLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = React.useState<string | null>(null);
  const nav = useNavigate();

  const [formFetchData, setFormFetchData] = useState<Form>();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<string, boolean>>({});
  const [nextQuestion, setNextQuestion] = useState<string | null>(null);

  const [currentSubQuestion, setCurrentSubQuestion] = useState<string | null>(null);

  const [questionColors, setQuestionColors] = useState<Record<string, string>>({});
  const [showQuestions, setShowQuestions] = useState<Record<string, boolean>>();

  const [engine] = useState(new Engine());

  useEffect(() => {
    const fetch = async () => {
      const [error, res] = await handleRequest(getForm());
      if (error) {
        handleError(error, setError, nav);
        return;
      }

      console.log(res);

      /*setFormFetchData(res as Form);
      setFormData(Object.fromEntries(res.questions.map(question => [question.id, ''])));
      setAnsweredQuestions(Object.fromEntries(res.questions.map(question => [question.id, false])));

      res.questions.forEach(question => {
        engine.addFact(question.id, () => formData[question.id]);
      });
      res.rules.forEach(rule => {
        engine.addRule(rule);
      });*/

      // A usar o Form hardcoded
      setFormFetchData(form);
      setFormData(Object.fromEntries(form.questions.map(question => [question.id, ''])));
      setAnsweredQuestions(Object.fromEntries(form.questions.map(question => [question.id, false])));

      form.questions.forEach(question => {
        engine.addFact(question.id, () => formData[question.id]);
      });
      form.rules.forEach(rule => {
        engine.addRule(rule);
      });

      //Inital question
      setCurrentSubQuestion(form.questions[0].id);

      setIsLoading(false);
    };

    if (isLoading) {
      fetch();
    }
  }, [engine, formData, formFetchData, isLoading, nav]);

  useEffect(() => {
    if (!formData && !formFetchData) return;

    setShowQuestions({});
    engine.run(formData).then(result => {
      result.results.forEach(result => {
        if (result.event.type === 'showQuestion' && result.event.params.subQuestion === currentSubQuestion) {
          //console.log('Showing question: ' + result.event.params.id);
          setShowQuestions(current => {
            return {
              ...current,
              [result.event.params.id]: true,
            };
          });
        }
        if (result.event.type == 'nextQuestion') {
          console.log('Can go to Next question: ' + result.event.params.id);
          setNextQuestion(result.event.params.id);
        }
      });
    });
  }, [currentSubQuestion, engine, formData, formFetchData]);

  function onChangeAnswer(questionId: string, answer: string) {
    setFormData({
      ...formData,
      [questionId]: answer,
    });
    setAnsweredQuestions({
      ...answeredQuestions,
      [questionId]: true,
    });

    setCurrentSubQuestion(questionId[0]);

    console.log('Answered question: ' + questionId + ' with answer: ' + answer);
    console.log('Answered questions: ' + JSON.stringify(answeredQuestions));
    console.log('Current SubQuestion: ' + currentSubQuestion);
  }

  function onEditRequest(questionId: string) {
    console.log('Edit Requested on question: ' + questionId);
    setAnsweredQuestions({
      ...answeredQuestions,
      [questionId]: false,
    });
  }

  function onNextQuestion(questionId: string) {
    console.log('Next question: ' + questionId);
    setShowQuestions(current => {
      for (const key in current) {
        current[key] = false;
      }
      current[questionId] = true;

      return { ...current };
    });
    //setCurrentSubQuestion(questionId[0]);
    setNextQuestion(null);
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
                        <BooleanButtons
                          onChangeAnswer={answer => {
                            setQuestionColors({
                              ...questionColors,
                              [question.id]: answer ? COLORS.LIGHT_GREEN : COLORS.LIGHT_RED,
                            });
                            onChangeAnswer(question.id, answer ? 'yes' : 'no');
                          }}
                        />
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
                          display: 'center',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Question text={question.text} color={questionColors[question.id]} />
                        {answeredQuestions[question.id] ? (
                          <EditButton onChangeAnswer={() => onEditRequest(question.id)} />
                        ) : (
                          <div style={{ marginTop: '20px', justifyContent: 'space-between' }}>{input}</div>
                        )}
                      </div>
                    )
                  );
                })}
                {nextQuestion != null && (
                  <NextQuestionButton
                    onNextQuestion={() => {
                      onNextQuestion(nextQuestion);
                    }}
                  />
                )}
              </div>
            )}
          </div>
        }
      </div>
    </div>
  );
}
