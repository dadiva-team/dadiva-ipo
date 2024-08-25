import { useState } from 'react';

export function useDialog() {
  const [questionId, setQuestionId] = useState<string | null>(null);
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState<string>('boolean');
  const [questionOptions, setQuestionOptions] = useState<string[]>([]);
  const [optionInput, setOptionInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAddOption = () => {
    if (optionInput.trim() !== '') {
      setQuestionOptions(oldOptions => [...(oldOptions ?? []), optionInput.trim()]);
      setOptionInput('');
    }
  };

  const handleRemoveOption = (index: number) => {
    setQuestionOptions(oldOptions => oldOptions.filter((_, i) => i !== index));
  };

  const moveOptionUp = (index: number) => {
    if (index > 0) {
      setQuestionOptions(oldOptions => {
        const newOptions = [...oldOptions];
        const temp = newOptions[index];
        newOptions[index] = newOptions[index - 1];
        newOptions[index - 1] = temp;
        return newOptions;
      });
    }
  };

  const moveOptionDown = (index: number) => {
    if (index < questionOptions.length - 1) {
      setQuestionOptions(oldOptions => {
        const newOptions = [...oldOptions];
        const temp = newOptions[index];
        newOptions[index] = newOptions[index + 1];
        newOptions[index + 1] = temp;
        return newOptions;
      });
    }
  };

  return {
    questionId,
    setQuestionId,
    questionText,
    setQuestionText,
    questionType,
    setQuestionType,
    questionOptions,
    setQuestionOptions,
    optionInput,
    setOptionInput,
    error,
    setError,
    handleAddOption,
    handleRemoveOption,
    moveOptionUp,
    moveOptionDown,
  };
}
