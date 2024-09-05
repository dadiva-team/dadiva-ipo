import React from 'react';
import { InputLabel, Select, MenuItem, TextField } from '@mui/material';
import { MedicationsInput, mockCountries } from '../../../../form/Inputs';
import { Question } from '../../../../../domain/Form/Form';

interface QuestionAnswersInputProps {
  question?: Question;
  questionCondition: string | null;
  conditionAnswer: string | null;
  setConditionAnswer: (value: string) => void;
}

export function createQuestionAnswersInput({
  question,
  questionCondition,
  conditionAnswer,
  setConditionAnswer,
}: QuestionAnswersInputProps) {
  if (!question) {
    return (
      <>
        <InputLabel id="selecionar-resposta-label">Resposta</InputLabel>
        <Select
          disabled={true}
          labelId="selecionar-resposta-label"
          id="selecionar-resposta-label"
          value=""
          label="Resposta"
        ></Select>
      </>
    );
  }

  switch (question.type) {
    case 'boolean':
      return (
        <>
          <InputLabel id="selecionar-resposta-label">Resposta</InputLabel>
          <Select
            disabled={!questionCondition}
            labelId="selecionar-resposta-label"
            id="selecionar-resposta-label"
            value={conditionAnswer ?? ''}
            label="Resposta"
            onChange={event => {
              setConditionAnswer(event.target.value);
            }}
          >
            <MenuItem value="yes">Sim</MenuItem>
            <MenuItem value="no">Não</MenuItem>
          </Select>
        </>
      );
    case 'text':
      return (
        <>
          <TextField
            disabled={!questionCondition}
            id="selecionar-resposta"
            label="Resposta"
            value={conditionAnswer ?? ''}
            onChange={event => setConditionAnswer(event.target.value)}
          />
        </>
      );
    case 'dropdown':
      return (
        <>
          <InputLabel id="selecionar-resposta-label">Resposta</InputLabel>
          <Select
            disabled={!questionCondition}
            labelId="selecionar-resposta-label"
            id="selecionar-resposta-label"
            value={conditionAnswer ?? ''}
            label="Resposta"
            onChange={event => {
              setConditionAnswer(event.target.value);
            }}
          >
            {question.options.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </>
      );
    case 'countries':
      return (
        <>
          <InputLabel id="selecionar-resposta-label">Resposta</InputLabel>
          <Select
            disabled={!questionCondition}
            labelId="selecionar-resposta-label"
            id="selecionar-resposta-label"
            value={conditionAnswer ?? ''}
            label="Resposta"
            onChange={event => {
              setConditionAnswer(event.target.value);
            }}
          >
            {mockCountries.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </>
      );
    case 'medications':
      return (
        <>
          <MedicationsInput
            onChangeAnswer={selectedOptions => {
              setConditionAnswer(selectedOptions.join(', '));
            }}
          />
        </>
      );
  }
}
