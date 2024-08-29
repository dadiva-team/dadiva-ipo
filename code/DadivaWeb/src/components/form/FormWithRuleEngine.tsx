import React, { JSX } from 'react';
import '../../App.css';
import { EditButton, NextQuestionButton, NavButtons, ReviewFormButton } from './Inputs';

import { Question } from './Question';
import { Box, Container, Paper } from '@mui/material';
import LoadingSpinner from '../shared/LoadingSpinner';
import { ErrorAlert } from '../shared/ErrorAlert';
import { Form } from '../../domain/Form/Form';
import { getInputComponent } from './utils/GetInputComponent';
import { Answer } from './utils/formUtils';

interface FormWithRuleEngineProps {
  isLoading: boolean;
  error: string | null;
  cleanError: () => void;
  formRawFetchData: Form;
  formAnswers: Record<string, Answer>[];
  answeredQuestions: Record<string, boolean>;
  showQuestions: Record<string, boolean>[];
  currentGroup: number;
  canGoNext: boolean;
  canGoReview: boolean;
  editingQuestion: string | null;
  questionColors: Record<string, string>;
  onChangeAnswer: (id: string, type: 'string' | 'boolean' | 'array', answer: string | boolean | string[]) => void;
  onEditRequest: (id: string, type: string) => void;
  onNextQuestion: () => void;
  onPrevQuestion: () => void;
  onReviewMode: () => void;
}

export default function FormWithRuleEngine({
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
  onReviewMode,
}: FormWithRuleEngineProps) {
  return (
    <Container>
      {
        <Box display="flex" justifyContent="center">
          {isLoading ? (
            <Box sx={{ mt: 1 }}>
              <LoadingSpinner text={'A carregar as perguntas...'} />
              <ErrorAlert error={error} clearError={cleanError} />
            </Box>
          ) : (
            <Paper
              elevation={2}
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                mt: 2,
                alignItems: 'center',
                width: '70%',
                borderRadius: 5,
                //border: '1.5px solid black', // First border with black color
                //boxShadow: '0 0 0 2px lightcoral', // Second border with light red color
              }}
            >
              <NavButtons
                onNextQuestion={() => onNextQuestion()}
                onPrevQuestion={() => onPrevQuestion()}
                prevEnabled={currentGroup > 0 && !editingQuestion}
                nextEnabled={currentGroup <= formRawFetchData.groups.length - 1 && canGoNext && !editingQuestion}
              />
              {formRawFetchData.groups[currentGroup]?.questions.map(question => {
                const input: JSX.Element = getInputComponent(question, onChangeAnswer);
                return (
                  showQuestions &&
                  showQuestions[currentGroup] &&
                  showQuestions[currentGroup][question.id] && (
                    <Box
                      key={question.id}
                      sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}
                      >
                        <Question
                          text={question.text}
                          color={questionColors[question.id]}
                          answer={formAnswers[currentGroup][question.id]}
                          isEditing={editingQuestion === question.id}
                        />
                        {!answeredQuestions[question.id] && <Box sx={{ pt: 1.5, width: '75%' }}> {input} </Box>}
                      </Box>
                      {answeredQuestions[question.id] && (
                        <EditButton
                          onChangeAnswer={() => onEditRequest(question.id, question.type)}
                          enableEdit={editingQuestion == null}
                        />
                      )}
                    </Box>
                  )
                );
              })}
              {editingQuestion == null &&
                (canGoReview ? (
                  <ReviewFormButton
                    onReview={() => {
                      onReviewMode();
                    }}
                  />
                ) : canGoNext ? (
                  <NextQuestionButton
                    onNextQuestion={() => {
                      onNextQuestion();
                    }}
                  />
                ) : null)}
            </Paper>
          )}
        </Box>
      }
    </Container>
  );
}
