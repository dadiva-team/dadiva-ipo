import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form } from '../../domain/Form/Form';
import { Engine } from 'json-rules-engine';
import { handleError, handleRequest } from '../../services/utils/fetch';
import { FormServices } from '../../services/from/FormServices';
import { updateFormAnswers, updateQuestionColors, updateShowQuestions } from './utils/FormUtils';
import { form } from './MockForm';

export function useNewForm() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

  const [formRawFetchData, setFormRawFetchData] = useState<Form>();
  const [formAnswers, setFormAnswers] = useState<Record<string, string>[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<string, boolean>>({});
  const [showQuestions, setShowQuestions] = useState<Record<string, boolean>[]>();
  const [questionColors, setQuestionColors] = useState<Record<string, string>>({});

  const [currentGroup, setCurrentGroup] = useState<number>(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [canGoNext, setCanGoNext] = useState<boolean>(false);
  const [canGoReview, setCanGoReview] = useState<boolean>(false);
  const [editingQuestion, setEditingQuestion] = useState<{ id: string; type: string } | null>(null);

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
        // setTotalQuestions(res.groups.reduce((total, group) => total + group.questions.length, 0));

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

        setIsLoading(false);
      });
    }
  }, [engine, formRawFetchData, isLoading, nav]);

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

  useEffect(() => {
    const checkAllQuestionsAnswered: () => boolean = () => {
      const totalAnsweredQuestions = Object.values(answeredQuestions).filter(answered => answered).length;
      return totalQuestions === totalAnsweredQuestions;
    };

    if (checkAllQuestionsAnswered()) {
      //console.log('All questions answered');
      //setCanGoReview(true);
    }
  }, [formAnswers, answeredQuestions, totalQuestions]);

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
    if (editingQuestion.type !== 'boolean' || answer == formAnswers[currentGroup][questionId]) {
      setEditingQuestion(null);
    } else {
      setEditingQuestion(null);
    }
  }

  /*function resetAndSetNextQuestion(updatedFormData: Record<string, string>, questionId: string, answer: string) {
    const isAnswerYes = answer !== 'no';
    console.log('isAnswerYes: ' + isAnswerYes);
    resetNextSubQuestions(updatedFormData, questionId, isAnswerYes);

    if (isAnswerYes) {
      setCanGoNext(false);
    }

    setEditingQuestion(null);
  }*/

  /*function resetNextSubQuestions(form: Record<string, string>, questionId: string, answer: boolean) {
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
  }*/

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
    canGoReview,
    editingQuestion,
    questionColors,
    onChangeAnswer,
    onEditRequest,
    onNextQuestion,
    onPrevQuestion,
  };
}
