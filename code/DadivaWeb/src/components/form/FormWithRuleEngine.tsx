import React, { JSX } from 'react';
import '../../App.css';
import { BooleanButtons, WrongQuestionType, EditButton, NextQuestionButton, TextInput, NavButtons } from './Inputs';

import { Question } from './Question';
import { CheckboxesTags } from './Inputs';
import { Box, Container, Paper } from '@mui/material';
import LoadingSpinner from '../shared/LoadingSpinner';
import { useNewForm } from './useNewForm';
import { ErrorAlert } from '../shared/ErrorAlert';

export default function FormWithRuleEngine() {
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
    editingQuestion,
    questionColors,
    onChangeAnswer,
    onEditRequest,
    onNextQuestion,
    onPrevQuestion,
  } = useNewForm();

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
              }}
            >
              <NavButtons
                onNextQuestion={() => onNextQuestion()}
                onPrevQuestion={() => onPrevQuestion()}
                prevEnabled={currentGroup > 0 && !editingQuestion}
                nextEnabled={currentGroup <= formRawFetchData.groups.length - 1 && canGoNext && !editingQuestion}
              />
              {formRawFetchData.groups[currentGroup]?.questions.map(question => {
                let input: JSX.Element;

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
                      <CheckboxesTags
                        options={question.options}
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
                return (
                  showQuestions &&
                  showQuestions[question.id] && (
                    <Box
                      key={question.id}
                      sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
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
                          isEditing={editingQuestion?.id === question.id}
                          type={question.type}
                        />
                        {!answeredQuestions[question.id] && <Box sx={{ height: 50, p: 1 }}> {input} </Box>}
                      </Box>
                      {answeredQuestions[question.id] && (
                        <EditButton
                          onChangeAnswer={() => onEditRequest(question.id, question.type)}
                          enableEdit={editingQuestion != null}
                        />
                      )}
                    </Box>
                  )
                );
              })}
              {editingQuestion == null && canGoNext && (
                <NextQuestionButton
                  onNextQuestion={() => {
                    onNextQuestion();
                  }}
                />
              )}
              {/*Object.values(formAnswers)
                .flat()
                .every(val => val !== '') && <SubmitFormButton onSubmit={onFinalQuestion*/}
            </Paper>
          )}
        </Box>
      }
    </Container>
  );
}
