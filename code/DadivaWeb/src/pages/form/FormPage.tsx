import { useNewForm } from '../../components/form/useNewForm';
import React from 'react';
import FormWithRuleEngine from '../../components/form/FormWithRuleEngine';
import { ReviewForm } from '../../components/form/ReviewForm';
import { Box, Button } from '@mui/material';
import { Form } from '../../domain/Form/Form';

interface FormProps {
  formPlayground?: Form;
}

export function FormPage({ formPlayground }: FormProps) {
  const {
    isLoading,
    error,
    cleanError,
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
    submitForm,
    reviewMode,
    onReviewMode,
  } = useNewForm(formPlayground);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {!reviewMode ? (
        <FormWithRuleEngine
          isLoading={isLoading}
          error={error}
          cleanError={cleanError}
          formRawFetchData={formRawFetchData}
          formAnswers={formAnswers}
          answeredQuestions={answeredQuestions}
          showQuestions={showQuestions}
          currentGroup={currentGroup}
          canGoNext={canGoNext}
          canGoReview={canGoReview}
          editingQuestion={editingQuestion}
          questionColors={questionColors}
          onChangeAnswer={(questionId, _type, answer) => onChangeAnswer(questionId, answer)}
          onEditRequest={onEditRequest}
          onNextQuestion={onNextQuestion}
          onPrevQuestion={onPrevQuestion}
          onReviewMode={onReviewMode}
        />
      ) : (
        <ReviewForm
          formData={formRawFetchData}
          formAnswers={formAnswers}
          questionColors={questionColors}
          showQuestions={showQuestions}
          onEditRequest={(questionId, _type, answer) => onChangeAnswer(questionId, answer)}
          onSubmitRequest={() => submitForm()}
          isPlaygroundTest={formPlayground != undefined}
        />
      )}
      <Button onClick={onReviewMode}>Review</Button>
    </Box>
  );
}
