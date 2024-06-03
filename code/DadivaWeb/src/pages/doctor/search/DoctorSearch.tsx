import React, { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import { DonorSearchName } from './DoctorSearchName';
import { DonorSearchNic } from './DoctorSearchNic';
import { DoctorSearchResult } from './DoctorSearchResult';
import { handleError, handleRequest } from '../../../services/utils/fetch';
import { useNavigate } from 'react-router-dom';
import { DoctorServices } from '../../../services/doctors/DoctorServices';
import { Submission } from '../../../domain/Submission';
import { ErrorAlert } from '../../../components/shared/ErrorAlert';
import LoadingSpinner from '../../../components/shared/LoadingSpinner';
import { FormServices } from '../../../services/from/FormServices';
import { Group } from '../../../domain/Form/Form';
import { FormCheck } from './FormCheck';

export interface DoctorSearchProps {
  mode: string;
}

export function DoctorSearch({ mode }: DoctorSearchProps) {
  const [errorForm, setErrorForm] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [nic, setNic] = useState<string>('');
  const [submission, setSubmissions] = useState<Submission>(null);
  const [formGroups, setFormGroups] = useState<Group[]>(null);
  const [formCheck, setFormCheck] = useState<boolean>(null);

  useEffect(() => {
    const fetch = async () => {
      const [error, res] = await handleRequest(FormServices.getForm());
      if (error) {
        handleError(error, setErrorForm, nav);
        return;
      }
      return res.groups as Group[];
    };

    if (formGroups == null) {
      fetch().then(res => {
        console.log(res);
        setFormGroups(res);
      });
    }
  }, [formGroups, nav]);

  const fetch = async () => {
    setError(null);
    setIsLoading(true);
    const [error, res] = await handleRequest(DoctorServices.getSubmissionByNic(Number(nic)));

    if (error) {
      handleError(error, setError, nav);
      setSubmissions(null);
      return;
    }

    setSubmissions(res as Submission);
  };

  return (
    <Box>
      {mode === 'name' ? (
        <Box>
          <DonorSearchName />
        </Box>
      ) : (
        <Box>
          {errorForm && <ErrorAlert error={errorForm} clearError={() => setErrorForm(null)} />}
          <DonorSearchNic
            nic={nic}
            setNic={nic => setNic(nic)}
            handleSearch={() => fetch().then(() => setIsLoading(false))}
            isSearching={isLoading}
          />
        </Box>
      )}
      {submission && (
        <DoctorSearchResult
          submission={submission}
          onCheckSubmission={() => {
            console.log('Checking submission...');
            setFormCheck(true);
          }}
        />
      )}
      {isLoading && <LoadingSpinner text={'A carregar...'} />}
      {error && <ErrorAlert error={error} clearError={() => setError(null)} />}
      {formCheck && submission && <FormCheck formGroups={formGroups} submission={submission} />}
      {submission && (
        <Box>
          <Button disabled={true}>Rejeitar formulário</Button>
          <Button disabled={true}>Aprovar formulário</Button>
        </Box>
      )}
    </Box>
  );
}
