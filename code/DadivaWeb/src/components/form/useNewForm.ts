import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form } from '../../domain/Form/Form';
import { Engine } from 'json-rules-engine';
import { handleError, handleRequest } from '../../services/utils/fetch';
import { FormServices } from '../../services/from/FormServices';
import {
  Answer,
  EMPTY_ANSWER,
  simplifyAnswers,
  SubmitFormResponse,
  updateFormAnswers,
  updateQuestionColors,
  updateShowQuestions,
} from './utils/formUtils';
import { useTranslation } from 'react-i18next';

export function useNewForm(playgroundForm?: Form) {
  const { i18n } = useTranslation();
  const nav = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formRawFetchData, setFormRawFetchData] = useState<Form>();
  const [formAnswers, setFormAnswers] = useState<Record<string, Answer>[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<string, boolean>>({});
  const [showQuestions, setShowQuestions] = useState<Record<string, boolean>[]>();
  const [questionColors, setQuestionColors] = useState<Record<string, string>>({});

  const [currentGroup, setCurrentGroup] = useState<number>(0);
  const [canGoNext, setCanGoNext] = useState<boolean>(false);
  const [canGoReview, setCanGoReview] = useState<boolean>(false);
  const [editingQuestion, setEditingQuestion] = useState<string>(null);

  const [engine] = useState(new Engine());
  const [reviewMode, setReviewMode] = useState(false);

  // Monitors
  /*useEffect(() => {
    //console.log('Form Data: ' + JSON.stringify(formRawFetchData));
    console.log('Show Questions: ' + JSON.stringify(showQuestions));
    console.log('Answered Questions: ' + JSON.stringify(answeredQuestions));
    console.log('Question Colors: ' + JSON.stringify(questionColors));
    console.log('Form answers: ' + JSON.stringify(formAnswers));
    //console.log('Current Group: ' + currentGroup);
  }, [formAnswers, showQuestions, currentGroup]);*/

  async function submitForm(): Promise<SubmitFormResponse> {
    const filteredFormAnswers = formAnswers.map((groupAnswers, groupIndex) => {
      const filteredGroupAnswers: Record<string, Answer> = {};

      Object.keys(groupAnswers).forEach(questionId => {
        if (showQuestions[groupIndex]?.[questionId]) {
          filteredGroupAnswers[questionId] = groupAnswers[questionId];
        }
      });

      return filteredGroupAnswers;
    });

    const [error, res] = await handleRequest(FormServices.submitForm(filteredFormAnswers, formRawFetchData.language));
    if (error) {
      handleError(error, setError, nav);
      return { success: false };
    }

    console.log('Form saved');
    if (res != null && res.submissionDate != null) {
      return { success: true, submissionDate: res.submissionDate };
    }

    return { success: false };
  }

  useEffect(() => {
    const fetch = async () => {
      if (playgroundForm) {
        return playgroundForm;
      }
      const [error, res] = await handleRequest(FormServices.getForm(i18n.language));
      if (error) {
        console.log('Error fetching form');
        handleError(error, setError, nav);
        return;
      }
      console.log('fetched form: ' + res);
      return res;
    };

    if (isLoading) {
      fetch().then(res => {
        setFormRawFetchData(res as Form);

        setFormAnswers(
          res.groups.map(group => {
            const groupAnswers: Record<string, Answer> = {};
            group.questions.forEach(question => {
              groupAnswers[question.id] = EMPTY_ANSWER;
            });
            return groupAnswers;
          })
        );

        setShowQuestions(
          res.groups.map(group => {
            const groupAnswers: Record<string, boolean> = {};
            group.questions.forEach(question => {
              groupAnswers[question.id] = false;
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
        console.log('Adding the following rules');
        console.log(res.rules);

        setIsLoading(false);
      });
    }
  }, [engine, formRawFetchData, isLoading, nav, playgroundForm, i18n.language]);

  useEffect(() => {
    if (!formRawFetchData) return;

    // Reset showQuestions for the current group
    setShowQuestions(prevShowQuestions =>
      prevShowQuestions.map((group, index) => {
        if (index === currentGroup) {
          const updatedGroup = { ...group };
          Object.keys(updatedGroup).forEach(key => {
            updatedGroup[key] = false;
          });
          return updatedGroup;
        }
        return group;
      })
    );

    engine.run(simplifyAnswers(formAnswers, currentGroup)).then(result => {
      setCanGoNext(false);
      setCanGoReview(false);
      setShowQuestions(prevShowQuestions =>
        prevShowQuestions.map((group, index) => {
          if (index === currentGroup) {
            const updatedGroup = { ...group };
            Object.keys(updatedGroup).forEach(key => {
              updatedGroup[key] = false;
            });
            return updatedGroup;
          }
          return group;
        })
      );

      result.results.forEach(result => {
        if (result.event.type === 'showQuestion') {
          setShowQuestions(prevShowQuestions =>
            updateShowQuestions(prevShowQuestions, currentGroup, result.event.params.id, true)
          );
        }
        if (result.event.type == 'nextGroup') {
          console.log('Next Group');
          setCanGoNext(true);
        }
        if (result.event.type == 'showReview') {
          console.log('Show Review');
          setCanGoReview(true);
        }
      });
    });
  }, [currentGroup, editingQuestion, engine, formAnswers, formRawFetchData]);

  function onChangeAnswer(questionId: string, answer: string | boolean | string[]) {
    const updatedFormAnswers = updateFormAnswers(formAnswers, currentGroup, questionId, answer);

    setFormAnswers(updatedFormAnswers);

    setQuestionColors({
      ...questionColors,
      [questionId]: updateQuestionColors(updatedFormAnswers[currentGroup][questionId]),
    });

    setAnsweredQuestions({
      ...answeredQuestions,
      [questionId]: true,
    });

    if (!editingQuestion || questionId !== editingQuestion) {
      return;
    }

    setEditingQuestion(null);
  }

  function onEditRequest(questionId: string) {
    if (editingQuestion != null) return;

    setAnsweredQuestions({
      ...answeredQuestions,
      [questionId]: false,
    });
    setQuestionColors({
      ...questionColors,
      [questionId]: '',
    });

    setEditingQuestion(questionId);
  }

  function onNextQuestion() {
    setCurrentGroup(() => currentGroup + 1);
    setCanGoNext(false);
  }

  function onPrevQuestion() {
    setCurrentGroup(() => currentGroup - 1);
  }
  // Tentativa de meter a reviewPage a dar a 100%
  function onReviewMode() {
    const review = !reviewMode;
    setReviewMode(review);

    if (review) {
      console.log('Review Mode');
      const simplifiedAnswers = formAnswers.reduce<Record<string, string | boolean | string[]>>((acc, group) => {
        Object.keys(group).forEach(key => {
          acc[key] = group[key].value;
        });
        return acc;
      }, {});

      engine.run(simplifiedAnswers).then(result => {
        setShowQuestions(prevShowQuestions => {
          let updatedShowQuestions = [...prevShowQuestions];
          result.results.forEach(result => {
            if (result.event.type === 'showQuestion') {
              updatedShowQuestions = updateShowQuestions(updatedShowQuestions, -1, result.event.params.id, true);
            }
          });
          return updatedShowQuestions;
        });
      });
    }
  }

  return {
    isLoading,
    error,
    cleanError: () => setError(null),
    submitForm,
    formRawFetchData,
    formAnswers,
    answeredQuestions,
    showQuestions,
    currentGroup,
    canGoNext,
    canGoReview,
    editingQuestion,
    questionColors,
    onChangeAnswer,
    onEditRequest,
    onNextQuestion,
    onPrevQuestion,
    reviewMode,
    onReviewMode,
  };
}
