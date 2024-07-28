import React, {useEffect, useState, useRef} from 'react';
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
import {Submission} from "../../domain/Submission/Submission";

export function PendingSubmissions() {
    const nav = useNavigate();
    const doc = useCurrentSession();

    const [error, setError] = useState<string>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [pendingSubmissions, setPendingSubmissions] = useState<SubmissionOutputModel[]>([]);
    const [submissionMap, setSubmissionMap] = useState<Map<Submission, Group[]>>(new Map());
    const [formGroupsCache, setFormGroupsCache] = useState<Map<number, Group[]> | null>(null);
    const [inconsistencies, setInconsistencies] = useState<Inconsistency[] | null>(null);
    const [lockedSubmissions, setLockedSubmissions] = useState<Set<number>>(new Set());


    const [currentReviewSubmission, setCurrentReviewSubmission] = useState<number | null>(null);
    const [forceCloseModal, setForceCloseModal] = useState(false);
    const [lockedByCurrentDoctor, setLockedByCurrentDoctor] = useState<SubmissionOutputModel | null>(null);

    const currentReviewSubmissionRef = useRef(currentReviewSubmission);

    useEffect(() => {
        currentReviewSubmissionRef.current = currentReviewSubmission;
    }, [currentReviewSubmission]);

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

            const newSubmissionsMap: Map<Submission, Group[]> = new Map([]);
            const newLockedSubmissions: Set<number> = new Set();
            for (const submission of res.submissions) {
                const formGroups = await fetchFormGroups(submission.submission.formVersion);
                newSubmissionsMap.set(submission.submission, formGroups);
                console.log('Submission:', submission.lockedByDoctorNic, doc.nic);
                if (submission.lockedByDoctorNic != null && submission.lockedByDoctorNic != doc.nic) {
                    newLockedSubmissions.add(submission.submission.id);
                } else if (submission.lockedByDoctorNic == doc.nic) {
                    setLockedByCurrentDoctor(submission);
                }
            }

            setSubmissionMap(newSubmissionsMap);
            setLockedSubmissions(newLockedSubmissions);
            setIsLoading(false);
            console.log('Submissions:', res.submissions);
        };
        if (pendingSubmissions.length === 0) {
            fetch();
        }

    }, [doc.nic, formGroupsCache, inconsistencies, nav, pendingSubmissions.length]);

    useEffect(() => {
        console.log('Opening connection to SSE. ', notificationsUri);

        const eventSource = new EventSource(notificationsUri);
        eventSource.onopen = () => {
            console.log('Connection to SSE opened.');
        };

        eventSource.onmessage = (event) => {
            console.log('Message received:', event.data);
            const data = JSON.parse(event.data);
            if (data.type === 'lock' || data.type === 'unlock') {
                setLockedSubmissions((prev) => {
                    const newSet = new Set(prev);
                    if (data.type === 'lock') {
                        newSet.add(data.submissionId);
                    } else {
                        newSet.delete(data.submissionId);
                        if (data.reason === 'timeout' && currentReviewSubmissionRef.current === data.submissionId) {
                            alert(`O tempo de revisão da submissão expirou.`);
                            setForceCloseModal(true);
                        }
                    }
                    console.log('Updated locked submissions:', newSet);
                    return newSet;
                });
            }
            if (data.type === 'review') {
                setPendingSubmissions((prev) => prev.filter((submission) => submission.submission.id !== data.submissionId));
            }
        };

        eventSource.onerror = (error) => {
            console.error('EventSource failed:', error);
            // Handle error but don't close the connection
        };

        return () => {
            console.log('Component unmounted, closing connection to SSE.');
            eventSource.close();
        };
    }, []);

    const handleOpenReview = (submissionId: number) => {
        setCurrentReviewSubmission(submissionId);
    };

    const handleCloseReview = () => {
        setCurrentReviewSubmission(null);
        setForceCloseModal(false);
    };


    return (
        <>
            {isLoading ? (
                <LoadingSpinner text={'A Carregar Submissões...'}/>
            ) : (
                <Paper sx={{p: 2}}>
                    {lockedByCurrentDoctor ? (
                        <>
                            <Typography variant="h6" sx={{p: 1, pb: 2, color: 'warning.main'}}>Tem uma revisão por concluir ...</Typography>
                            <Box>
                                <PendingSubmissionCard
                                    formGroups={submissionMap.get(lockedByCurrentDoctor.submission)}
                                    inconsistencies={inconsistencies}
                                    submission={lockedByCurrentDoctor.submission}
                                    locked={false}
                                    doctorNic={doc.nic}
                                    isReviewing={currentReviewSubmission === lockedByCurrentDoctor.submission.id}
                                    onSubmitedSuccessfully={() => {
                                        setLockedByCurrentDoctor(null)
                                    }}
                                    onOpenReview={() => handleOpenReview(lockedByCurrentDoctor.submission.id)}
                                    onCloseReview={() => {
                                        handleCloseReview()
                                        setLockedByCurrentDoctor(null)
                                    }}
                                    forceCloseModal={forceCloseModal}
                                />
                            </Box>
                        </>
                    ) : (
                        <>
                            <Typography variant="h6" sx={{p: 1, pb: 2}}> Submissões Pendentes </Typography>
                            {error && <ErrorAlert error={error} clearError={() => setError(null)}/>}
                            {pendingSubmissions.map(({submission}) => (
                                <Box key={submission.id}>
                                    <PendingSubmissionCard
                                        formGroups={submissionMap.get(submission)}
                                        inconsistencies={inconsistencies}
                                        submission={submission}
                                        locked={lockedSubmissions.has(submission.id)}
                                        onSubmitedSuccessfully={() => {
                                        }}
                                        doctorNic={doc.nic}
                                        isReviewing={currentReviewSubmission === submission.id}
                                        onOpenReview={() => handleOpenReview(submission.id)}
                                        onCloseReview={handleCloseReview}
                                        forceCloseModal={forceCloseModal}
                                    />
                                    <Divider sx={{p: 0.5}}/>
                                </Box>
                            ))}
                        </>
                    )}
                </Paper>
            )}
        </>
    );
}
