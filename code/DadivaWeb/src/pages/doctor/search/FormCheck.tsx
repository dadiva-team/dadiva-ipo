import { Group } from '../../../domain/Form/Form';
import { Submission } from '../../../domain/Submission';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import {
  buildFormWithAnswers,
  checkFormValidity,
  extractInconsistencies,
  Inconsistency,
  QuestionWithAnswer,
} from './utils/DoctorSearchAux';
import { Box, Button, Divider } from '@mui/material';
import LoadingSpinner from '../../../components/shared/LoadingSpinner';
import { ErrorAlert } from '../../../components/shared/ErrorAlert';
import Typography from '@mui/material/Typography';
import { FormDetails } from './FormDetails';
import { PendingActionAlert } from '../../../components/shared/PendingActionAlert';
import { handleError, handleRequest } from '../../../services/utils/fetch';
import { FormServices } from '../../../services/from/FormServices';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import CloseIcon from '@mui/icons-material/Close';

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
    const fetch = async () => {
      const [error, res] = await handleRequest(FormServices.getInconsistencies());
      if (error) {
        handleError(error, setError, nav);
        setIsLoading(false); // stop loading if there is an error
        return;
      }
      const inconsistencies = res.length > 0 ? extractInconsistencies(res[0]) : [];
      setInconsistencies(inconsistencies.length == 0 ? null : inconsistencies);
    };

    if (inconsistencies == null) {
      fetch().then(() => setIsLoading(false));
    }
  }, [inconsistencies, nav]);

  useEffect(() => {
    if (formWithAnswers == null) {
      setFormWithAnswers(buildFormWithAnswers({ formGroups, donorAnswers: submission.answers }));
    }
  }, [formWithAnswers, formGroups, submission]);

  useEffect(() => {
    if (formWithAnswers != null && inconsistencies != null) {
      setInvalidQuestions(checkFormValidity(formWithAnswers, inconsistencies).invalidQuestions);
    }
  }, [formWithAnswers, inconsistencies]);

  return (
    <Box>
      {isLoading ? (
        <Box sx={{ mt: 1 }}>
          <LoadingSpinner text={'A calcular...'} />
          <ErrorAlert error={error} clearError={() => setError(null)} />
        </Box>
      ) : (
        <Box>
          <Typography>Formulario submetido: {submission.submissionDate}</Typography>
          {invalidQuestions?.length > 0 ? (
            <Box>
              <ErrorAlert error={'Formulário parcialmente inválido'} clearError={() => setError(null)} />
              <Typography variant="h6">
                Existem inconsistências no formulário. Por favor, reveja as seguintes questões:
              </Typography>
              <Divider sx={{ p: 0.5 }} />
              {invalidQuestions.map(question => (
                <Box
                  key={question.id}
                  sx={{ pl: 1.5, pt: 1, display: 'flex', justifyContent: 'space-between', width: '70%' }}
                >
                  <Typography sx={{ width: '70%' }}>{question.question}</Typography>
                  <Typography sx={{ width: '30%' }}>Resposta: {question.answer}</Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <PendingActionAlert
              actionMessage={'Formulario parcialmente validado'}
              clearActionMessage={() => console.log(':D')}
            />
          )}
          <Box sx={{ pt: 2 }}>
            <Button
              variant="outlined"
              endIcon={!showDetails ? <ManageSearchIcon /> : <CloseIcon />}
              onClick={() => setShowDetails(!showDetails)}
            >
              Respostas
            </Button>
          </Box>
          {showDetails && formWithAnswers && (
            <Box sx={{ pt: 2 }}>
              <FormDetails formWithAnswers={formWithAnswers} invalidQuestions={invalidQuestions} />
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
