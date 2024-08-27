import {
  BooleanButtons,
  DropdownInput,
  CountriesInput,
  MedicationsInput,
  TextInput,
  WrongQuestionType,
} from '../Inputs';
import React from 'react';

export function getInputComponent(
  question: { id: string; type: string; options: string[] },
  onChangeAnswer: (id: string, type: string, answer: string | string[]) => void
) {
  let input;
  switch (question.type) {
    case 'boolean':
      input = (
        <BooleanButtons
          onChangeAnswer={answer => {
            onChangeAnswer(question.id, question.type, answer ? 'yes' : 'no');
          }}
        />
      );
      break;
    case 'text':
      input = <TextInput onChangeAnswer={answer => onChangeAnswer(question.id, question.type, answer)} />;
      break;
    case 'dropdown':
      input = (
        <DropdownInput
          options={question.options}
          onChangeAnswer={answer => {
            onChangeAnswer(question.id, question.type, answer);
          }}
        />
      );
      break;
    case 'medications':
      input = (
        <MedicationsInput
          onChangeAnswer={answer => {
            onChangeAnswer(question.id, question.type, answer);
          }}
        />
      );
      break;
    case 'countries':
      input = (
        <CountriesInput
          onChangeAnswer={answer => {
            onChangeAnswer(question.id, question.type, answer);
          }}
        />
      );
      break;
    default:
      input = <WrongQuestionType />;
      break;
  }
  return input;
}
