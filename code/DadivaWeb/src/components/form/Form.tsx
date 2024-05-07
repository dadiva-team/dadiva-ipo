import React, { JSX, useEffect, useState } from 'react';
import '../../App.css';
import {
  BooleanButtons,
  WrongQuestionType,
  EditButton,
  NextQuestionButton,
  SubmitFormButton,
  TextInput,
} from './Inputs';

import { Engine } from 'json-rules-engine';
import { Form } from '../../domain/Form/Form';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../../services/utils/colors';
import { Question } from './Question';
import { form } from './MockForm';
import { CheckboxesTags } from './Inputs';
import { parseQuestionId } from './utils/FormUtils';

export default function Form() {
  const [isLoading, setIsLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = React.useState<string | null>(null);
  const nav = useNavigate();

  const [formFetchData, setFormFetchData] = useState<Form>();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<string, boolean>>({});

  const [nextQuestion, setNextQuestion] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);

  const [questionColors, setQuestionColors] = useState<Record<string, string>>({});
  const [showQuestions, setShowQuestions] = useState<Record<string, boolean>>();
  const [editingQuestion, setEditingQuestion] = useState<{ id: string; type: string } | null>(null);

  const [engine] = useState(new Engine());

  useEffect(() => {
    const fetch = async () => {
      /*const [error, res] = await handleRequest(getForm());
      if (error) {
        handleError(error, setError, nav);
        return;
      }

      console.log(res);

      setFormFetchData(res as Form);
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

      setCurrentQuestion(form.questions[0].id);
      setIsLoading(false);
    };

    if (isLoading) {
      fetch();
    }
  }, [engine, formData, formFetchData, isLoading, nav]);

  useEffect(() => {
    if (!formData && !formFetchData && !currentQuestion) return;

    setShowQuestions({});
    engine.run(formData).then(result => {
      result.results.forEach(result => {
        if (
          result.event.type === 'showQuestion' &&
          result.event.params.subQuestion == parseQuestionId(currentQuestion).letter
        ) {
          setShowQuestions(current => {
            return {
              ...current,
              [result.event.params.id]: true,
            };
          });
        }
        if (
          result.event.type == 'nextQuestion' &&
          result.event.params.subQuestion != parseQuestionId(currentQuestion).letter
        ) {
          setNextQuestion(result.event.params.id);
          console.log('Next question: ' + currentQuestion);
        }
        if (result.event.type == 'final question') {
          console.log('Final question');
        }
      });
    });
  }, [currentQuestion, editingQuestion, engine, formData, formFetchData]);

  // Monitors
  /*useEffect(() => {
    console.log('Form Data: ' + JSON.stringify(formData));
    console.log('Answered questions: ' + JSON.stringify(answeredQuestions));
    console.log('Show Questions: ' + JSON.stringify(showQuestions));
    console.log('Current SubQuestion: ' + currentQuestion);
  }, [formData, answeredQuestions]);*/

  function onChangeAnswer(questionId: string, answer: string) {
    const updatedFormData = { ...formData, [questionId]: answer };
    const updatedAnsweredQuestions = { ...answeredQuestions, [questionId]: true };

    setFormData(updatedFormData);
    setAnsweredQuestions(updatedAnsweredQuestions);
    setCurrentQuestion(questionId);

    if (!editingQuestion || questionId !== editingQuestion.id) {
      return;
    }

    if (editingQuestion.type === 'dropdown' || answer === formData[questionId]) {
      setEditingQuestion(null);
    } else {
      resetAndSetNextQuestion(updatedFormData, questionId, answer);
    }

    /*if (editingQuestion != null && questionId == editingQuestion.id && answer != formData[questionId]) {
      if (answer == 'no') {
        resetNextSubQuestions(updatedFormData, questionId, false);
      } else {
        resetNextSubQuestions(updatedFormData, questionId, true);
        setNextQuestion(null);
      }
      setEditingQuestion(null);
    }*/
  }

  function resetAndSetNextQuestion(updatedFormData: Record<string, string>, questionId: string, answer: string) {
    const isAnswerNo = answer !== 'no';
    resetNextSubQuestions(updatedFormData, questionId, isAnswerNo);

    if (isAnswerNo) {
      setNextQuestion(null);
    }

    setEditingQuestion(null);
  }

  function resetNextSubQuestions(form: Record<string, string>, questionId: string, answer: boolean) {
    const { letter, number } = parseQuestionId(questionId);

    const newShowQuestions = { ...showQuestions };
    const newAnsweredQuestions = { ...answeredQuestions, [questionId]: true };
    const newFormData = { ...form };
    const newColor = { ...questionColors, [questionId]: answer ? COLORS.LIGHT_GREEN : COLORS.LIGHT_RED };

    Object.keys(form).forEach(key => {
      if (key.startsWith(letter)) {
        const keyNumber = parseQuestionId(key).number;

        // If the question is a subquestion of the current question
        if (keyNumber > number) {
          newShowQuestions[key] = answer;
          newAnsweredQuestions[key] = !answer;
          newFormData[key] = answer ? '' : 'no';
          newColor[key] = answer ? '' : COLORS.LIGHT_RED;
        }
      }
    });

    setShowQuestions(newShowQuestions);
    setAnsweredQuestions(newAnsweredQuestions);
    setFormData(newFormData);
    setQuestionColors(newColor);
  }

  function fillSubQuestions(questionId: string) {
    const { letter, number } = parseQuestionId(questionId);

    const newAnsweredQuestions = { ...answeredQuestions };
    const newFormData = { ...formData };

    Object.keys(newFormData).forEach(key => {
      if (key.startsWith(letter)) {
        const keyNumber = parseQuestionId(key).number;

        // If the question is a subquestion of the current question
        if (keyNumber > number) {
          if (keyNumber > number) {
            newAnsweredQuestions[key] = true;
            newFormData[key] = 'no';
          }
        }
      }
    });

    setAnsweredQuestions(newAnsweredQuestions);
    setFormData(newFormData);
  }

  function onEditRequest(questionId: string, type: string) {
    if (editingQuestion != null) return;

    setAnsweredQuestions({
      ...answeredQuestions,
      [questionId]: false,
    });
    setQuestionColors({
      ...questionColors,
      [questionId]: '',
    });

    setEditingQuestion({ id: questionId, type: type });
  }

  function onNextQuestion(questionId: string) {
    console.log('Next question: ' + questionId);

    // Fills the subquestions with 'no' if the event is 'nextQuestion'
    fillSubQuestions(currentQuestion);

    setNextQuestion(null);
    setCurrentQuestion(questionId);
  }

  function onFinalQuestion() {
    console.log('Final question');
    nav('/review-form');
  }

  return (
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
                  case 'dropdown':
                    input = (
                      <CheckboxesTags
                        options={question.options}
                        onChangeAnswer={answer => {
                          setQuestionColors({
                            ...questionColors,
                            [question.id]: answer.length > 0 ? COLORS.LIGHT_GREEN : COLORS.LIGHT_RED,
                          });
                          onChangeAnswer(question.id, answer);
                        }}
                      />
                    );
                    break;
                  default:
                    input = <WrongQuestionType />;
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
                        <EditButton
                          onChangeAnswer={() => onEditRequest(question.id, question.type)}
                          enableEdit={editingQuestion != null}
                        />
                      ) : (
                        <div style={{ marginTop: '20px', justifyContent: 'space-between' }}>{input}</div>
                      )}
                    </div>
                  )
                );
              })}
              {nextQuestion != null && editingQuestion == null && (
                <NextQuestionButton
                  onNextQuestion={() => {
                    onNextQuestion(nextQuestion);
                  }}
                />
              )}
              {Object.values(answeredQuestions).every(val => val === true) &&
                Object.keys(answeredQuestions).length === form.questions.length && (
                  <SubmitFormButton onSubmit={onFinalQuestion} />
                )}
            </div>
          )}
        </div>
      }
    </div>
  );
}
