import React from 'react';
import { Alert, Backdrop, Box, Button, Container, Grid, Paper, Snackbar, styled } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { Form } from '../../../domain/Form/Form';
import Typography from '@mui/material/Typography';
import { FormEditDialog } from '../FormEditDialog';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useTranslation } from 'react-i18next';
import { Answer, SubmitFormResponse } from '../utils/formUtils';
import { useReviewForm } from './useReviewForm';

interface ReviewFormProps {
  formData: Form;
  formAnswers: Record<string, Answer>[];
  questionColors: Record<string, string>;
  showQuestions: Record<string, boolean>[];
  onEditRequest: (
    questionId: string,
    type: 'string' | 'boolean' | 'array',
    answer: string | boolean | string[]
  ) => void;
  onSubmitRequest: () => Promise<SubmitFormResponse>;
  isPlaygroundTest: boolean;
}

interface ItemProps {
  questionid: string;
}

export function ReviewForm({
  formData,
  formAnswers,
  questionColors,
  showQuestions,
  onEditRequest,
  onSubmitRequest,
  isPlaygroundTest,
}: ReviewFormProps) {
  const { t } = useTranslation();

  const {
    handleOpen,
    handleClose,
    handleSubmit,
    open,
    selectedQuestion,
    snackbarOpen,
    backdropOpen,
    submitDisabled,
    setSnackbarOpen,
  } = useReviewForm(onSubmitRequest);

  const Item = styled(Paper)<ItemProps>(({ theme, questionid }) => ({
    backgroundColor: questionColors[questionid],
    ...theme.typography.h6,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    border: 2,
  }));

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
        border: 6,
        borderColor: 'lightgray',
        borderRadius: 10,
      }}
    >
      {formData &&
        formData.groups.map((group, groupIndex) => (
          <Box
            key={groupIndex}
            sx={{
              mb: 2,
              p: 2,
              borderRadius: '8px',
              width: '100%',
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              {group.name}
            </Typography>

            <Grid container direction="column" spacing={1}>
              {group.questions.map(
                (question, questionIndex) =>
                  showQuestions[groupIndex][question.id] && (
                    <Grid item xs={12} key={questionIndex}>
                      <Item
                        sx={{
                          bgcolor: questionColors[question.id],
                          p: 1,
                          mb: 1,
                          borderRadius: 5,
                          border: 2,
                        }}
                        questionid={question.id}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            height: '100%',
                          }}
                        >
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" sx={{ textAlign: 'left' }}>
                              {question.text}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}
                          >
                            {formAnswers[groupIndex][question.id]?.type === 'boolean' &&
                            formAnswers[groupIndex][question.id]?.value === true ? (
                              <CheckCircleIcon sx={{ fontSize: 40, marginRight: 1 }} />
                            ) : formAnswers[groupIndex][question.id]?.type === 'boolean' &&
                              formAnswers[groupIndex][question.id]?.value === false ? (
                              <CancelIcon sx={{ fontSize: 40, marginRight: 1 }} />
                            ) : null}

                            {formAnswers[groupIndex][question.id]?.type === 'string' &&
                              formAnswers[groupIndex][question.id]?.value && (
                                <Box
                                  sx={{
                                    justifyContent: 'left',
                                    border: 2,
                                    borderColor: 'darkgreen',
                                    borderRadius: 1,
                                    bgcolor: 'grey.200',
                                    p: 1,
                                  }}
                                >
                                  <Typography
                                    variant="body1"
                                    sx={{
                                      textAlign: 'left',
                                      maxWidth: '100%',
                                      whiteSpace: 'pre-wrap',
                                      overflowWrap: 'break-word',
                                      wordBreak: 'break-all',
                                    }}
                                  >
                                    {t('ResponseForm')}: {formAnswers[groupIndex][question.id].value as string}
                                  </Typography>
                                </Box>
                              )}

                            {formAnswers[groupIndex][question.id]?.type === 'array' &&
                              formAnswers[groupIndex][question.id]?.value && (
                                <Box
                                  sx={{
                                    justifyContent: 'left',
                                    border: 2,
                                    borderColor: 'darkgreen',
                                    borderRadius: 1,
                                    bgcolor: 'grey.200',
                                    p: 1,
                                  }}
                                >
                                  <Typography
                                    variant="body1"
                                    sx={{
                                      textAlign: 'left',
                                      maxWidth: '100%',
                                      whiteSpace: 'pre-wrap',
                                      overflowWrap: 'break-word',
                                      wordBreak: 'break-all',
                                    }}
                                  >
                                    {t('ResponseForm')}:{' '}
                                    {(formAnswers[groupIndex][question.id].value as string[]).join(', ')}
                                  </Typography>
                                </Box>
                              )}

                            <Button
                              onClick={() => handleOpen(question)}
                              startIcon={<EditIcon />}
                              variant="contained"
                              color="primary"
                              disabled={submitDisabled}
                              sx={{ borderRadius: 5, marginRight: 1 }}
                            >
                              {t('Edit')}
                            </Button>
                          </Box>
                        </Box>
                      </Item>
                    </Grid>
                  )
              )}
              <FormEditDialog
                open={open}
                onClose={handleClose}
                question={selectedQuestion}
                onAnswer={(id, type, answer) => onEditRequest(id, type, answer)}
              />
            </Grid>
          </Box>
        ))}
      {formData && !isPlaygroundTest && !snackbarOpen && (
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          sx={{ width: '50%', borderRadius: 5, justifyContent: 'bottom' }}
          disabled={submitDisabled}
        >
          {t('Submit Form')}
        </Button>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={10000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{
            width: '100%',
            fontSize: '1.25rem',
            padding: '16px',
            maxWidth: '600px',
            margin: '0 auto',
            boxShadow: 3,
          }}
        >
          {t('Form submitted successfully')}
        </Alert>
      </Snackbar>
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={backdropOpen}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  );
}
