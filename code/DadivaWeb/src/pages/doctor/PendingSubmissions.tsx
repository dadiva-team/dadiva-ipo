import React, {useEffect, useState} from 'react';
import {handleError, handleRequest} from '../../services/utils/fetch';
import {FormServices} from '../../services/from/FormServices';
import {DoctorServices} from '../../services/doctors/DoctorServices';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import {Group} from '../../domain/Form/Form';
import {SubmissionOutputModel} from '../../services/doctors/models/SubmissionOutputModel';
import {Box, Divider, Paper, Typography} from '@mui/material';
import {useNavigate} from "react-router-dom";
import {ErrorAlert} from "../../components/shared/ErrorAlert";
import {extractInconsistencies, Inconsistency} from "./search/utils/DoctorSearchAux";
import {PendingSubmissionCard} from "./PendingSubmissionCard";

export function PendingSubmissions() {
    const nav = useNavigate();
    const [error, setError] = useState<string>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [pendingSubmissions, setPendingSubmissions] = useState([]);
    const [submissionsMap, setSubmissionsMap] = useState<Map<SubmissionOutputModel, Group[]>>(new Map());
    const [formGroupsCache, setFormGroupsCache] = useState<Map<number, Group[]> | null>(null);
    const [inconsistencies, setInconsistencies] = useState<Inconsistency[] | null>(null);

    useEffect(() => {
        async function fetchFormGroups(formVersion: number): Promise<Group[]> {
            if (formGroupsCache?.has(formVersion)) {
                return formGroupsCache.get(formVersion)!;
            } else {
                const [error, res] = await handleRequest(FormServices.getFormByVersion(formVersion));
                if (error) {
                    handleError(error, setError, nav);
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

        const fetchInconsistencies = async () => {
            if (inconsistencies) return;
            const [error, res] = await handleRequest(FormServices.getInconsistencies());
            if (error) {
                handleError(error, setError, nav);
                setIsLoading(false);
                return;
            }
            const inc = res.length > 0 ? extractInconsistencies(res[0]) : [];
            setInconsistencies(inc.length == 0 ? null : inc);
        };

        const fetch = async () => {
            const [err, res] = await handleRequest(DoctorServices.getPendingSubmissions());
            if (err) {
                setIsLoading(false);
                handleError(err, setError, nav);
                return;
            }
            await fetchInconsistencies();
            setPendingSubmissions(res.submissions);
            const newSubmissionsMap: Map<SubmissionOutputModel, Group[]> = new Map([]);
            for (const submission of res.submissions) {
                const formGroups = await fetchFormGroups(submission.formVersion);
                newSubmissionsMap.set(submission, formGroups);
            }
            setSubmissionsMap(newSubmissionsMap);
            setIsLoading(false);
            console.log('Submissions:', res.submissions);
        };
        fetch();
    }, [formGroupsCache, inconsistencies, nav]);

    return (
        <>
            {isLoading ? (
                <LoadingSpinner text={'A Carregar Submissões...'}/>
            ) : (
                <Paper sx={{p: 2}}>
                    <Typography variant="h6" sx={{p: 1}}> Submissões Pendentes </Typography>
                    {error && <ErrorAlert error={error} clearError={() => {
                        setError(null)
                    }}/>}
                    {pendingSubmissions.map(submission => (
                        <Box key={submission.id}>
                            <PendingSubmissionCard
                                formGroups={submissionsMap.get(submission)}
                                inconsistencies={inconsistencies}
                                submission={submission}
                                onSubmitedSuccessfully={() => window.location.reload()}
                            />
                            <Divider sx={{p: 0.5}}/>
                        </Box>
                    ))}
                </Paper>
            )
            }
        </>
    )
}

