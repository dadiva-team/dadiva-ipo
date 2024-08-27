import { Box, Button, Container, Paper, styled } from '@mui/material';
import { Grid } from '@mui/material';
import React, { useState } from 'react';
import { Form, Question } from '../../domain/Form/Form';
import Typography from '@mui/material/Typography';
import { FormEditDialog } from './FormEditDialog';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useTranslation } from 'react-i18next';

interface ReviewFormProps {
  formData: Form;
  formAnswers: Record<string, string>[];
  questionColors: Record<string, string>;
  showQuestions: Record<string, boolean>[];
  onEditRequest: (questionId: string, type: string, answer: string) => void;
  onSubmitRequest: () => void;
  isPlaygroundTest: boolean;
}

interface ItemProps {
  questionid: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ReviewForm({
  formData,
  formAnswers,
  questionColors,
  showQuestions,
  onEditRequest,
  onSubmitRequest,
  isPlaygroundTest,
}: ReviewFormProps) {
  const [open, setOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question>(null);
  const { t } = useTranslation();

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

  const handleOpen = (question: Question) => {
    setSelectedQuestion(question);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedQuestion(null);
    setOpen(false);
  };

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
                            {question.type === 'boolean' && formAnswers[groupIndex][question.id] === 'yes' ? (
                              <CheckCircleIcon sx={{ fontSize: 40, marginRight: 1 }} />
                            ) : question.type === 'boolean' && formAnswers[groupIndex][question.id] === 'no' ? (
                              <CancelIcon sx={{ fontSize: 40, marginRight: 1 }} />
                            ) : null}
                            {formAnswers[groupIndex][question.id] &&
                              !['yes', 'no'].includes(formAnswers[groupIndex][question.id]) && (
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
                                    Resposta: {formAnswers[groupIndex][question.id]}
                                  </Typography>
                                </Box>
                              )}

                            <Button
                              onClick={() => handleOpen(question)}
                              startIcon={<EditIcon />}
                              variant="contained"
                              color="primary"
                              sx={{ borderRadius: 5, marginRight: 1 }}
                            >
                              Editar
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
      {formData && !isPlaygroundTest && (
        <Button
          onClick={onSubmitRequest}
          variant="contained"
          color="primary"
          sx={{ width: '50%', borderRadius: 5, justifyContent: 'bottom' }}
        >
          {t('Submit Form')}
        </Button>
      )}
    </Container>
  );
}
