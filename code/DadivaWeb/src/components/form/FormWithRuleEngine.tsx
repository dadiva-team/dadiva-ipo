import React, { JSX, useEffect, useState } from 'react';
import '../../App.css';
import { BooleanButtons, WrongQuestionType, EditButton, NextQuestionButton, TextInput, NavButtons } from './Inputs';

import { Engine } from 'json-rules-engine';
import { Form } from '../../domain/Form/Form';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../../services/utils/colors';
import { Question } from './Question';
import { CheckboxesTags } from './Inputs';
import { updateFormAnswers } from './utils/FormUtils';
import { handleError, handleRequest } from '../../services/utils/fetch';
import { FormServices } from '../../services/from/FormServices';
import { form } from './MockForm';
import { Box } from '@mui/material';
import LoadingSpinner from '../common/LoadingSpinner';

export default function FormWithRuleEngine() {
  const [isLoading, setIsLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = React.useState<string | null>(null);
  const nav = useNavigate();

  const [formRawFetchData, setFormRawFetchData] = useState<Form>();
  const [formAnswers, setFormAnswers] = useState<Record<string, string>[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<string, boolean>>({});
  const [showQuestions, setShowQuestions] = useState<Record<string, boolean>>();

  const [currentGroup, setCurrentGroup] = useState<number>(0);
  const [canGoNext, setCanGoNext] = useState<boolean>(false);
  const [editingQuestion, setEditingQuestion] = useState<{ id: string; type: string } | null>(null);

  const [questionColors, setQuestionColors] = useState<Record<string, string>>({});
  const [engine] = useState(new Engine());

  useEffect(() => {
    const fetch = async () => {
      // eslint-disable-next-line prefer-const
      let [error, res] = await handleRequest(FormServices.getForm());
      if (error) {
        handleError(error, setError, nav);
        return;
      }

      // HARD CODED FORM for tests
      res = form;

      setFormAnswers(
        res.groups.map(group => {
          const groupAnswers: Record<string, string> = {};
          group.questions.forEach(question => {
            groupAnswers[question.id] = '';
          });
          return groupAnswers;
        })
      );

      setFormRawFetchData(res as Form);

      res.groups.forEach(group => {
        group.questions.forEach(question => {
          engine.addFact(question.id, () => '');
        });
      });
      res.rules.forEach(rule => {
        engine.addRule(rule);
      });

      setIsLoading(false);
    };

    if (isLoading) {
      fetch();
    }
  }, [engine, formRawFetchData, isLoading, nav]);

  useEffect(() => {
    if (!formRawFetchData) return;
    setShowQuestions({});

    engine.run(formAnswers[currentGroup]).then(result => {
      result.results.forEach(result => {
        if (result.event.type === 'showQuestion') {
          setShowQuestions(current => {
            return {
              ...current,
              [result.event.params.id]: true,
            };
          });
        }
        if (result.event.type == 'nextGroup') {
          setCanGoNext(true);
        }
      });
    });
  }, [currentGroup, editingQuestion, engine, formAnswers, formRawFetchData]);

  // Monitors
  /*useEffect(() => {
    //console.log('Form Data: ' + JSON.stringify(formRawFetchData));
    console.log('Show Questions: ' + JSON.stringify(showQuestions));
    console.log('Answered Questions: ' + JSON.stringify(answeredQuestions));
    console.log('Form answers: ' + JSON.stringify(formAnswers));
    console.log('Current Group: ' + currentGroup);
  }, [formAnswers, showQuestions, currentGroup]);*/

  function onChangeAnswer(questionId: string, answer: string) {
    const updatedFormData = updateFormAnswers(formAnswers, currentGroup, questionId, answer);

    setFormAnswers(updatedFormData);
    setAnsweredQuestions({
      ...answeredQuestions,
      [questionId]: true,
    });

    if (!editingQuestion || questionId !== editingQuestion.id) {
      return;
    }

    // Dropdown em principio n tem respostas erradas por isso sempre q é editada n ha problema
    if (editingQuestion.type === 'dropdown') {
      setEditingQuestion(null);
    } else {
      resetAndSetNextQuestion(updatedFormData[currentGroup], questionId, answer);
    }
  }

  function resetAndSetNextQuestion(updatedFormData: Record<string, string>, questionId: string, answer: string) {
    const isAnswerYes = answer !== 'no';
    resetNextSubQuestions(updatedFormData, questionId, isAnswerYes);

    if (isAnswerYes) {
      //setNextQuestion(null);
    }

    setEditingQuestion(null);
  }

  function resetNextSubQuestions(form: Record<string, string>, questionId: string, answer: boolean) {
    const newShowQuestions = { ...showQuestions };
    const newFormAnswers = updateFormAnswers(formAnswers, currentGroup, questionId, answer ? 'yes' : 'no');
    const newAnsweredQuestions = { ...answeredQuestions, [questionId]: true };
    const newColor = { ...questionColors, [questionId]: answer ? COLORS.LIGHT_GREEN : COLORS.LIGHT_RED };

    let resetMode = false;

    Object.keys(form).forEach(key => {
      if (key === questionId) {
        resetMode = true;
      } else if (resetMode) {
        newShowQuestions[key] = answer;
        newFormAnswers[currentGroup][key] = answer ? '' : 'no';
        newAnsweredQuestions[key] = !answer;
        newColor[key] = answer ? '' : COLORS.LIGHT_RED;
      }
    });

    setAnsweredQuestions(newAnsweredQuestions);
    setFormAnswers(newFormAnswers);
    setShowQuestions(newShowQuestions);
    setQuestionColors(newColor);
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

  function onNextQuestion() {
    setCurrentGroup(() => currentGroup + 1);
    setCanGoNext(false);
  }

  function onPrevQuestion() {
    setCurrentGroup(() => currentGroup - 1);
  }

  return (
    <div>
      {
        <div>
          {isLoading ? (
            <Box sx={{ mt: 1 }}>
              <LoadingSpinner text={'A carregar as perguntas...'} />
            </Box>
          ) : (
            <div>
              <NavButtons
                onNextQuestion={() => onNextQuestion()}
                onPrevQuestion={() => onPrevQuestion()}
                prevEnabled={currentGroup > 0}
                nextEnabled={currentGroup <= formRawFetchData.groups.length - 1 && canGoNext && !editingQuestion}
              />
              {formRawFetchData.groups[currentGroup]?.questions.map(question => {
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
                      <Question
                        text={question.text}
                        color={questionColors[question.id]}
                        answer={formAnswers[currentGroup][question.id]}
                        isEditing={editingQuestion?.id === question.id}
                        type={question.type}
                      />
                      {answeredQuestions[question.id] ? (
                        <EditButton
                          onChangeAnswer={() => onEditRequest(question.id, question.type)}
                          enableEdit={editingQuestion != null}
                        />
                      ) : (
                        <div style={{ marginTop: '20px', marginBottom: '20px', justifyContent: 'space-between' }}>
                          {input}
                        </div>
                      )}
                    </div>
                  )
                );
              })}
              {editingQuestion == null && canGoNext && (
                <NextQuestionButton
                  onNextQuestion={() => {
                    onNextQuestion();
                  }}
                />
              )}
              {/*Object.values(formAnswers).every(val => val. === true) && (
                <SubmitFormButton onSubmit={onFinalQuestion} />
              )*/}
            </div>
          )}
        </div>
      }
    </div>
  );
}
