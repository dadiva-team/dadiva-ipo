import { Group } from '../../../domain/Form/Form';
import { Submission } from '../../../domain/Submission';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { BuildFormWithAnswers, CheckFormValidity, Inconsistency, QuestionWithAnswer } from './utils/DoctorSearchAux';
import { Box, Button, Divider } from '@mui/material';
import LoadingSpinner from '../../../components/shared/LoadingSpinner';
import { ErrorAlert } from '../../../components/shared/ErrorAlert';
import Typography from '@mui/material/Typography';
import { FormDetails } from './FormDetails';
import { PendingActionAlert } from '../../../components/shared/PendingActionAlert';

interface FormCheckProps {
  formGroups: Group[];
  submission: Submission;
}

export function FormCheck({ formGroups, submission }: FormCheckProps) {
  const nav = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [inconsistencies, setInconsistencies] = useState<Inconsistency[]>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formWithAnswers, setFormWithAnswers] = useState<QuestionWithAnswer[]>(null);
  const [invalidQuestions, setInvalidQuestions] = useState<QuestionWithAnswer[]>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  useEffect(() => {
    /*const fetch = async () => {
      const [error, res] = await handleRequest(FormServices.getInconsistencies());
      if (error) {
        handleError(error, setError, nav);
        return;
      }
      return res as Inconsistency[];
    };*/

    // TODO ir buscar as inconsistencies

    if (inconsistencies == null) {
      setInconsistencies([
        { questionId: 'q3', invalidValue: 'no' },
        { questionId: 'q2', invalidValue: 'no' },
      ]);
      setIsLoading(false);
    }
    if (formWithAnswers == null) {
      setFormWithAnswers(BuildFormWithAnswers({ formGroups, donorAnswers: submission.answers }));
    }

    if (invalidQuestions == null) {
      setInvalidQuestions(CheckFormValidity(formWithAnswers, inconsistencies).invalidQuestions);
    }
  }, [inconsistencies, formWithAnswers, submission, formGroups, invalidQuestions, nav]);

  return (
    <Box>
      {isLoading ? (
        <Box sx={{ mt: 1 }}>
          <LoadingSpinner text={'A calcular...'} />
          <ErrorAlert error={error} clearError={() => setError(null)} />
        </Box>
      ) : (
        <Box>
          <Typography>Formulario submetido {submission.submissionDate}</Typography>
          {invalidQuestions?.length > 0 ? (
            <Box>
              <ErrorAlert error={'Formulário inválido'} clearError={() => setError(null)} />
              <Typography>Existem inconsistências no formulário. Por favor, reveja as seguintes questões:</Typography>
              <Divider />
              {invalidQuestions.map(question => (
                <Box key={question.id}>
                  <Typography>{question.question}</Typography>
                  <Typography>Resposta: {question.answer}</Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <PendingActionAlert
              actionMessage={'Formulario parcialmente validado'}
              clearActionMessage={() => console.log(':D')}
            />
          )}
          <Button onClick={() => setShowDetails(!showDetails)}>Ver respostas do dador</Button>
          {showDetails && formWithAnswers && <FormDetails formWithAnswers={formWithAnswers} />}
        </Box>
      )}
    </Box>
  );
}
