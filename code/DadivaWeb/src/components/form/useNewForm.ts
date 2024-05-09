import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form } from '../../domain/Form/Form';
import { Engine } from 'json-rules-engine';
import { handleError, handleRequest } from '../../services/utils/fetch';
import { FormServices } from '../../services/from/FormServices';
import { form } from './MockForm';
import { updateFormAnswers, updateQuestionColors } from './utils/FormUtils';
import { COLORS } from '../../services/utils/colors';

export function useNewForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const nav = useNavigate();

  const [formRawFetchData, setFormRawFetchData] = useState<Form>();
  const [formAnswers, setFormAnswers] = useState<Record<string, string>[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<string, boolean>>({});
  const [showQuestions, setShowQuestions] = useState<Record<string, boolean>>();
  const [questionColors, setQuestionColors] = useState<Record<string, string>>({});

  const [currentGroup, setCurrentGroup] = useState<number>(0);
  const [canGoNext, setCanGoNext] = useState<boolean>(false);
  const [editingQuestion, setEditingQuestion] = useState<{ id: string; type: string } | null>(null);

  const [engine] = useState(new Engine());

  // Monitors
  /*useEffect(() => {
    //console.log('Form Data: ' + JSON.stringify(formRawFetchData));
    console.log('Show Questions: ' + JSON.stringify(showQuestions));
    console.log('Answered Questions: ' + JSON.stringify(answeredQuestions));
    console.log('Form answers: ' + JSON.stringify(formAnswers));
    console.log('Current Group: ' + currentGroup);
  }, [formAnswers, showQuestions, currentGroup]);*/

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
      return res;
    };

    if (isLoading) {
      fetch().then(res => {
        setFormRawFetchData(res as Form);
        setFormAnswers(
          res.groups.map(group => {
            const groupAnswers: Record<string, string> = {};
            group.questions.forEach(question => {
              groupAnswers[question.id] = '';
            });
            return groupAnswers;
          })
        );

        res.groups.forEach(group => {
          group.questions.forEach(question => {
            engine.addFact(question.id, () => '');
          });
        });
        res.rules.forEach(rule => {
          engine.addRule(rule);
        });

        setIsLoading(false);
      });
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
        if (result.event.type == 'endForm') {
          //nav('/end');
        }
      });
    });
  }, [currentGroup, editingQuestion, engine, formAnswers, formRawFetchData]);

  function onChangeAnswer(questionId: string, questionType: string, answer: string) {
    const updatedFormAnswers = updateFormAnswers(formAnswers, currentGroup, questionId, answer);

    setFormAnswers(updatedFormAnswers);
    setQuestionColors({
      ...questionColors,
      [questionId]: updateQuestionColors(questionId, questionType, answer),
    });
    setAnsweredQuestions({
      ...answeredQuestions,
      [questionId]: true,
    });

    if (!editingQuestion || questionId !== editingQuestion.id) {
      return;
    }

    // Dropdown em principio n tem respostas erradas por isso sempre q é editada n ha problema
    if (editingQuestion.type === 'dropdown' || answer == formAnswers[currentGroup][questionId]) {
      setEditingQuestion(null);
    } else {
      resetAndSetNextQuestion(updatedFormAnswers[currentGroup], questionId, answer);
    }
  }

  function resetAndSetNextQuestion(updatedFormData: Record<string, string>, questionId: string, answer: string) {
    const isAnswerYes = answer !== 'no';
    console.log('isAnswerYes: ' + isAnswerYes);
    resetNextSubQuestions(updatedFormData, questionId, isAnswerYes);

    if (isAnswerYes) {
      setCanGoNext(false);
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

  return {
    isLoading,
    error,
    cleanError: () => setError(null),
    formRawFetchData,
    formAnswers,
    answeredQuestions,
    showQuestions,
    currentGroup,
    canGoNext,
    editingQuestion,
    questionColors,
    onChangeAnswer,
    onEditRequest,
    onNextQuestion,
    onPrevQuestion,
  };
}
