import * as React from 'react';
import { useEffect, useState } from 'react';
import { getForm } from '../../services/from/FormServices';

class Question {
  questionText: string;
  subQuestions: SubQuestion[] | null;
}

class SubQuestion {
  rule: boolean;
  question: Question;
  responseType: string;
}

//TODO:proof of concept
export default function Form() {
  const [currentSubQuestions, setCurrentSubQuestions] = useState<Record<string, string | null>>({});
  const [form, setForm] = useState({ questions: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Function to fetch form data
    getForm().then(form => {
      console.log(form);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      setForm(form);
      setIsLoading(false);
    });
  }, []); // Empty array ensures this runs once on mount

  function onQuestionAnswer(value: boolean, mainQuestion: string, subQuestions: SubQuestion[] | undefined) {
    console.log('Question Answered');
    if (subQuestions === null) return;

    if (subQuestions[0].rule === value) {
      console.log('adding [' + mainQuestion + ']: ' + subQuestions[0].question.questionText);
      setCurrentSubQuestions({
        ...currentSubQuestions,
        [mainQuestion]: subQuestions[0].question.questionText,
      });
    } else {
      setCurrentSubQuestions({
        ...currentSubQuestions,
        [mainQuestion]: null,
      });
    }
  }

  async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    console.log('Respostas submetidas');
  }

  if (isLoading) {
    return <div>Loading...</div>; // Here you can replace the text with a spinner component or similar
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {form.questions.map(mainQuestion => (
          <div key={mainQuestion.questionText}>
            <h1> {mainQuestion.questionText} </h1>
            <input
              type="radio"
              id="Sim"
              name={mainQuestion.questionText}
              onChange={() => onQuestionAnswer(true, mainQuestion.questionText, mainQuestion.subQuestions)}
            />
            <label htmlFor="Sim">Sim</label>
            <input
              type="radio"
              id="Nao"
              name={mainQuestion.questionText}
              onChange={() => onQuestionAnswer(false, mainQuestion.questionText, mainQuestion.subQuestions)}
            />
            <label htmlFor="Nao">Não</label>
            {currentSubQuestions[mainQuestion.questionText] && (
              <div>{currentSubQuestions[mainQuestion.questionText]}</div>
            )}
          </div>
        ))}
        <button type="submit">Submeter</button>
      </form>
    </div>
  );
}
