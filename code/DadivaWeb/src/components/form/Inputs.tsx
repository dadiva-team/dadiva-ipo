import React from 'react';

export function BooleanRadio(questionName: string, onChangeAnswer: (answer: boolean) => void) {
  return (
    <div>
      <input type="radio" id="yes" name={questionName} value="yes" onChange={() => onChangeAnswer(true)} />
      <label htmlFor="huey">Sim</label>
      <input type="radio" id="no" name={questionName} value="no" onChange={() => onChangeAnswer(false)} />
      <label htmlFor="huey">Não</label>
    </div>
  );
}

export function TextInput(questionID: string, onChangeAnswer: (answer: string) => void) {
  return <input type="text" id={questionID} name={questionID} onChange={e => onChangeAnswer(e.target.value)} />;
}

export function DefaultQuestionType() {
  return <div>Wrong Question Type detected. Please, do not proceed</div>;
}
