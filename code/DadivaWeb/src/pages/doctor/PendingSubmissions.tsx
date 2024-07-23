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
import {useCurrentSession} from "../../session/Session";
import {notificationsUri} from "../../services/utils/WebApiUris";

export function PendingSubmissions() {
    const nav = useNavigate();
    const [error, setError] = useState<string>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [pendingSubmissions, setPendingSubmissions] = useState<SubmissionOutputModel[]>([]);
    const [submissionsMap, setSubmissionsMap] = useState<Map<SubmissionOutputModel, Group[]>>(new Map());
    const [formGroupsCache, setFormGroupsCache] = useState<Map<number, Group[]> | null>(null);
    const [inconsistencies, setInconsistencies] = useState<Inconsistency[] | null>(null);
    const [lockedSubmissions, setLockedSubmissions] = useState<Set<number>>(new Set());
    const doc = useCurrentSession();

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
            setPendingSubmissions(res.submissions as SubmissionOutputModel[]);
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

    useEffect(() => {
        console.log('Opening connection to SSE. ', notificationsUri);

        const eventSource = new EventSource(notificationsUri);
        eventSource.onopen = function () {
            console.log('Connection to SSE opened.');
        };
        console.log('EventSource:', eventSource.readyState);

        eventSource.onmessage = function (event) {
            console.log('Message received:', event.data);
            const data = JSON.parse(event.data);
            if (data.type === 'lock' || data.type === 'unlock') {
                setLockedSubmissions(prev => {
                    const newSet = new Set(prev);
                    if (data.type === 'lock') {
                        newSet.add(data.submissionId);
                    } else {
                        newSet.delete(data.submissionId);
                    }
                    console.log('Updated locked submissions:', newSet);
                    return newSet;
                });
            }
        };

        eventSource.onerror = function (error) {
            console.error('EventSource failed:', error);
            // Handle error but don't close the connection
        };

        return () => {
            console.log('Component unmounted, closing connection to SSE.');
            eventSource.close();
        };
    }, []);

    useEffect(() => {
        console.log("Monitor")
        console.log(lockedSubmissions)
    }, [lockedSubmissions])

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
                    {pendingSubmissions.map(submission => {
                        /*console.log(`Submission ID: ${submission.id}, Locked By Doctor NIC: ${submission.lockedByDoctorNic}, SameDoctor: ${submission.lockedByDoctorNic == doc.nic},
                        Doctor NIC: ${doc.nic}, Locked Submissions: ${lockedSubmissions.has(submission.id)}, if: ${(submission.lockedByDoctorNic !== null && submission.lockedByDoctorNic != doc.nic)}`);*/
                        return (
                            <Box key={submission.id}>
                                <PendingSubmissionCard
                                    formGroups={submissionsMap.get(submission)}
                                    inconsistencies={inconsistencies}
                                    submission={submission}
                                    onSubmitedSuccessfully={() => window.location.reload()} // Temporary solution
                                    //forceOpenModal={(lockedSubmissions.has(submission.id) ||submission.lockedByDoctorNic !== null && submission.lockedByDoctorNic == doc.nic)}
                                    locked={lockedSubmissions.has(submission.id) || (submission.lockedByDoctorNic !== null && submission.lockedByDoctorNic != doc.nic)}
                                    doctorNic={doc.nic}
                                />
                                <Divider sx={{p: 0.5}}/>
                            </Box>
                        );
                    })}
                </Paper>
            )
            }
        </>
    )
}

