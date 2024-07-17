import React, { useEffect, useState } from 'react';
import { PendingSubmissionResults } from './search/pendingSubmission/PendingSubmissionResults';
import { handleRequest } from '../../services/utils/fetch';
import { FormServices } from '../../services/from/FormServices';
import { DoctorServices } from '../../services/doctors/DoctorServices';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { Group } from '../../domain/Form/Form';
import { SubmissionOutputModel } from '../../services/doctors/models/SubmissionOutputModel';
import { Divider } from '@mui/material';

export function PendingSubmissions() {
  const [isLoading, setIsLoading] = useState(true);
  const [pendingSubmissions, setPendingSubmissions] = useState([]);
  const [submissionsMap, setSubmissionsMap] = useState<Map<SubmissionOutputModel, Group[]>>(new Map());
  const [formGroupsCache, setFormGroupsCache] = useState<Map<number, Group[]> | null>(null);

  useEffect(() => {
    async function fetchFormGroups(formVersion: number): Promise<Group[]> {
      if (formGroupsCache?.has(formVersion)) {
        return formGroupsCache.get(formVersion)!;
      } else {
        const [error, res] = await handleRequest(FormServices.getFormByVersion(formVersion));
        if (error) {
          return [];
        }
        const formGroups = res.groups as Group[];
        if (formGroupsCache) {
          setFormGroupsCache(new Map(formGroupsCache.set(formVersion, formGroups)));
        } else {
          setFormGroupsCache(new Map([[formVersion, formGroups]]));
        }
        return formGroups;
      }
    }

    const fetch = async () => {
      const [err, res] = await handleRequest(DoctorServices.getPendingSubmissions());
      if (err) {
        console.error(err);
        return;
      }
      setPendingSubmissions(res.submissions);
      const newSubmissionsMap: Map<SubmissionOutputModel, Group[]> = new Map([]);
      for (const submission of res.submissions) {
        const formGroups = await fetchFormGroups(submission.formVersion);
        newSubmissionsMap.set(submission, formGroups);
      }
      setSubmissionsMap(newSubmissionsMap);
      setIsLoading(false);
    };
    fetch();
  }, [formGroupsCache]);

  return (
    <>
      {isLoading ? (
        <LoadingSpinner text={'A Carregar Submissões...'} />
      ) : (
        <>
          {pendingSubmissions.map(submission => (
            <>
              <PendingSubmissionResults
                key={submission.id}
                formGroups={submissionsMap.get(submission) || []}
                inconsistencies={/*inconsistencies ||*/ []}
                submission={submission}
                onSubmitedSuccessfully={() => {}}
              />{' '}
              <Divider sx={{ p: 0.5 }} />
            </>
          ))}
        </>
      )}
    </>
  );
}
