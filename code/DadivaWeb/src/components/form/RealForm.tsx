import React, { JSX, useEffect, useState } from 'react';
import '../../App.css';
import {
  BooleanButtons,
  DefaultQuestionType,
  EditButton,
  NextQuestionButton,
  SubmitFormButton,
  TextInput,
} from './Inputs';

import { Engine } from 'json-rules-engine';
import { Form } from '../../domain/Form/Form';
import { handleError, handleRequest } from '../../services/utils/fetch';
import { getForm } from '../../services/from/FormServices';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../../services/utils/colors';
import { Question } from './Question';
import { form } from './MockForm';

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
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);

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
          setShowQuestions(current => {
            return {
              ...current,
              [result.event.params.id]: true,
            };
          });
        }
        if (result.event.type == 'nextQuestion' && result.event.params.subQuestion != currentSubQuestion) {
          console.log('Can go to Next question: ' + result.event.params.id);
          setNextQuestion(result.event.params.id);
        }
        if (result.event.type == 'final question') {
          console.log('Final question');
        }
      });
    });
  }, [currentSubQuestion, editingQuestion, engine, formData, formFetchData]);

  // Monitors
  /*useEffect(() => {
    console.log('Form Data: ' + JSON.stringify(formData));
    console.log('Answered questions: ' + JSON.stringify(answeredQuestions));
    console.log('Show Questions: ' + JSON.stringify(showQuestions));
    console.log('Current SubQuestion: ' + currentSubQuestion);
  }, [answeredQuestions]);*/

  function onChangeAnswer(questionId: string, answer: string) {
    const updatedFormData = { ...formData, [questionId]: answer };
    const updatedAnsweredQuestions = { ...answeredQuestions, [questionId]: true };

    setFormData(updatedFormData);
    setAnsweredQuestions(updatedAnsweredQuestions);
    setCurrentSubQuestion(questionId[0]);
    setEditingQuestion(null);
  }

  function onEditRequest(questionId: string) {
    console.log('Edit Requested on question: ' + questionId);
    setAnsweredQuestions({
      ...answeredQuestions,
      [questionId]: false,
    });
    /*setQuestionColors({
      ...questionColors,
      [questionId]: '',
    });*/
    setEditingQuestion(questionId);
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
    setNextQuestion(null);
  }

  function onFinalQuestion() {
    console.log('Final question');
    nav('/');
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

/*
const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export function MyModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              A Submeter o seu questionario
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}*/
