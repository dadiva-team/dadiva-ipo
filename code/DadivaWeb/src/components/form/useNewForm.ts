import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form } from '../../domain/Form/Form';
import { Engine } from 'json-rules-engine';
import { handleError, handleRequest } from '../../services/utils/fetch';
import { FormServices } from '../../services/from/FormServices';
import { updateFormAnswers, updateQuestionColors, updateShowQuestions } from './utils/FormUtils';
import { useCurrentSession, useUpdateSessionStatus } from '../../session/Session';
import { AccountStatus } from '../../services/users/models/LoginOutputModel';

export function useNewForm(playgroundForm?: Form) {
  const session = useCurrentSession();
  const updateSessionStatus = useUpdateSessionStatus();
  const nic = session?.nic;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

  const [formRawFetchData, setFormRawFetchData] = useState<Form>();
  const [formAnswers, setFormAnswers] = useState<Record<string, string>[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<string, boolean>>({});
  const [showQuestions, setShowQuestions] = useState<Record<string, boolean>[]>();
  const [questionColors, setQuestionColors] = useState<Record<string, string>>({});

  const [currentGroup, setCurrentGroup] = useState<number>(0);
  const [canGoNext, setCanGoNext] = useState<boolean>(false);
  const [canGoReview, setCanGoReview] = useState<boolean>(false);
  const [editingQuestion, setEditingQuestion] = useState<string>(null);

  const [engine] = useState(new Engine());

  // Monitors
  /*useEffect(() => {
    //console.log('Form Data: ' + JSON.stringify(formRawFetchData));
    console.log('formRawFetchData: ' + JSON.stringify(formRawFetchData));
    console.log('Show Questions: ' + JSON.stringify(showQuestions));
    console.log('Answered Questions: ' + JSON.stringify(answeredQuestions));
    console.log('Form answers: ' + JSON.stringify(formAnswers));
    console.log('Current Group: ' + currentGroup);
  }, [formAnswers, showQuestions, currentGroup]);*/

  async function submitForm() {
    if (!nic) {
      setError('No NIC found in session');
      return;
    }

    const nicNumber = Number(nic);
    if (isNaN(nicNumber)) {
      setError('NIC is not a valid number');
      return;
    }
    // TODO: Filter answers

    const [error, res] = await handleRequest(FormServices.submitForm(nic, formAnswers, formRawFetchData.formVersion));
    if (error) {
      handleError(error, setError, nav);
      return;
    }
    console.log('Form saved');
    if (res) {
      console.log('res ', res);
      updateSessionStatus(AccountStatus.PendingReview, res);
      nav('/');
    }
  }

  useEffect(() => {
    const fetch = async () => {
      if (playgroundForm) {
        return playgroundForm;
      }
      const [error, res] = await handleRequest(FormServices.getForm());
      if (error) {
        handleError(error, setError, nav);
        return;
      }
      // Mock form for tests
      //res = form;
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
  }, [engine, formRawFetchData, isLoading, nav, playgroundForm]);

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

    engine.run(formAnswers[currentGroup]).then(result => {
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

    if (!editingQuestion || questionId !== editingQuestion) {
      return;
    }

    if (editingQuestion !== 'boolean' || answer == formAnswers[currentGroup][questionId]) {
      setEditingQuestion(null);
    } else {
      setEditingQuestion(null);
    }
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
  };
}
