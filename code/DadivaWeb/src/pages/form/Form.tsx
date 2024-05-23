import { useNewForm } from '../../components/form/useNewForm';
import React, { useState } from 'react';
import FormWithRuleEngine from '../../components/form/FormWithRuleEngine';
import { ReviewForm } from '../../components/form/ReviewForm';
import { Box, Button } from '@mui/material';

export function Form() {
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
  } = useNewForm();

  const [reviewMode, setReviewMode] = useState(true);

  return reviewMode ? (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
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
        onChangeAnswer={onChangeAnswer}
        onEditRequest={onEditRequest}
        onNextQuestion={onNextQuestion}
        onPrevQuestion={onPrevQuestion}
        onReviewMode={() => setReviewMode(!reviewMode)}
      />
      <Button onClick={() => setReviewMode(!reviewMode)}>Review</Button>
    </Box>
  ) : (
    <Box>
      <ReviewForm
        formData={formRawFetchData}
        formAnswers={formAnswers}
        questionColors={questionColors}
        showQuestions={showQuestions}
        onEditRequest={(questionId, type, answer) => onChangeAnswer(questionId, type, answer)}
      />
      <Button onClick={() => setReviewMode(!reviewMode)}>Review</Button>
    </Box>
  );
}
