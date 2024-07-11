import React, {useState} from 'react';
import {Box, Paper} from '@mui/material';
import {DonorSearchName} from './DoctorSearchName';
import {DonorSearchNic} from './DoctorSearchNic';
import {DoctorSearchResult} from './DoctorSearchResult';
import {handleError, handleRequest} from '../../../services/utils/fetch';
import {useNavigate} from 'react-router-dom';
import {DoctorServices} from '../../../services/doctors/DoctorServices';
import {Submission} from '../../../domain/Submission/Submission';
import {ErrorAlert} from '../../../components/shared/ErrorAlert';
import LoadingSpinner from '../../../components/shared/LoadingSpinner';
import {FormServices} from '../../../services/from/FormServices';
import {Group} from '../../../domain/Form/Form';
import {PendingSubmissionResults} from './pendingSubmission/PendingSubmissionResults';
import {User} from "../../../domain/User/User";
import {SubmissionHistory} from "../../../domain/Submission/SubmissionHistory";
import {OldSubmissionsResults} from "./oldSubmissions/OldSubmissionsResults";

export interface DoctorSearchProps {
    mode: string;
}

export function DoctorSearch({mode}: DoctorSearchProps) {
    const nav = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [errorForm, setErrorForm] = useState<string | null>(null);
    const [errorSubmission, setErrorSubmission] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [nic, setNic] = useState<string>('');
    const [pendingSubmission, setPendingSubmission] = useState<Submission | null>(null);

    const [oldSubmissions, setOldSubmissions] = useState<SubmissionHistory[]>([]);
    const [user, setUser] = useState<User>(null);

    const [formGroupsCache, setFormGroupsCache] = useState<Map<number, Group[]>>(new Map());
    const [pendingView, setPendingView] = useState<boolean>(null);
    const [oldView, setOldView] = useState<boolean>(null);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [submissionLimit, setSubmissionLimit] = useState(2);
    const [submissionSkip, setSubmissionSkip] = useState(0);
    const [hasMoreSubmissions, setHasMoreSubmissions] = useState(true);

    const fetchFormGroups = async (formVersion: number): Promise<Group[]> => {
        if (formGroupsCache.has(formVersion)) {
            return formGroupsCache.get(formVersion)!;
        } else {
            const [error, res] = await handleRequest(FormServices.getFormByVersion(formVersion));
            if (error) {
                handleError(error, setErrorForm, nav);
                return [];
            }
            const formGroups = res.groups as Group[];
            setFormGroupsCache(new Map(formGroupsCache.set(formVersion, formGroups)));
            return formGroups;
        }
    };

    const fetchUser = async () => {
        setError(null);
        setIsLoading(true);
        const [error, res] = await handleRequest(DoctorServices.getUserByNic(Number(nic)));

        if (error) {
            handleError(error, setError, nav);
            setPendingSubmission(null);
            setUser(null);
            setIsLoading(false);
            return;
        }

        setUser({name: res.name, nic: res.nic.toString()});
        setIsLoading(false);
    };

    const fetchPendingSubmission = async () => {
        if (!user) return;
        if (errorSubmission) setErrorSubmission(null);

        const [error, res] = await handleRequest(DoctorServices.getPendingSubmissionByNic(Number(user.nic)));
        if (error) {
            handleError(error, setErrorSubmission, nav);
            setPendingSubmission(null);
            return;
        }
        await fetchFormGroups(res.formVersion);
        setPendingSubmission(res as Submission);
        setPendingView(true);
        setOldView(false)
    };

    const fetchSubmissionHistory = async (limit: number, skip: number, reset: boolean) => {
        if (!user) return;
        if (errorSubmission) setErrorSubmission(null);
        if (reset) {
            setOldSubmissions([]);
            setSubmissionSkip(0)
        }

        const [error, res] = await handleRequest(DoctorServices.getSubmissionHistoryByNic(Number(user.nic), limit, skip));
        if (error) {
            handleError(error, setErrorSubmission, nav);
            setOldSubmissions([]);
            return;
        }

        const {submissionHistory, hasMoreSubmissions} = res

        setHasMoreSubmissions(hasMoreSubmissions);
        setOldSubmissions(prevSubmissions => [...prevSubmissions, ...(submissionHistory)]);
        setOldView(true);
        setPendingView(false);
    };

    const loadMoreSubmissions = () => {
        const newSkip = submissionSkip + submissionLimit;
        console.log('Loading more submissions');
        console.log("Skip: " + newSkip);
        setSubmissionSkip(newSkip);
        fetchSubmissionHistory(submissionLimit, newSkip, false);
    };
    const togglePendingView = () => {
        setPendingView(true);
        setOldView(false);
    };

    const toggleOldView = () => {
        setPendingView(false);
        setOldView(true);
    };

    return (
        <Box sx={{pr: 1}}>
            {mode === 'name' ? (
                <Box>
                    <DonorSearchName/>
                </Box>
            ) : (
                <Box>
                    {errorForm && <ErrorAlert error={errorForm} clearError={() => setErrorForm(null)}/>}
                    <DonorSearchNic
                        nic={nic}
                        setNic={nic => setNic(nic)}
                        handleSearch={() => fetchUser()}
                        isSearching={isLoading}
                    />
                </Box>
            )}
            {error && <ErrorAlert error={error} clearError={() => setError(null)}/>}
            {isLoading && <LoadingSpinner text={'A carregar...'}/>}
            {user && (
                <Paper elevation={2} sx={{padding: 2, display: 'flex', flexDirection: 'row', alignItems: 'flex-start'}}>
                    <DoctorSearchResult
                        user={user}
                        pendingView={pendingView}
                        historyView={oldView}
                        onCheckPendingSubmission={fetchPendingSubmission}
                        onCheckOldSubmissions={(reset) => fetchSubmissionHistory(2, 0, reset)}  //TODO: Tirar o hardcode do limit e skip
                        pendingAndOldView={pendingSubmission && oldSubmissions?.length > 0}
                        onTogglePendingView={togglePendingView}
                        onToggleHistoryView={toggleOldView}

                    />
                    <Box sx={{marginLeft: 2, width: '80%', borderLeft: '6px solid #1976d2', pl: 2}}>
                        {errorSubmission &&
                            <ErrorAlert error={errorSubmission} clearError={() => setErrorSubmission(null)}/>
                        }
                        {pendingView && pendingSubmission && (
                            <PendingSubmissionResults
                                formGroups={formGroupsCache.get(pendingSubmission.formVersion) || []}
                                submission={pendingSubmission}
                            />
                        )}
                        {oldView && oldSubmissions && (
                            <OldSubmissionsResults
                                submissions={oldSubmissions}
                                loadMoreSubmissions={loadMoreSubmissions}
                                hasMoreSubmissions={hasMoreSubmissions}
                            />
                        )}
                    </Box>

                </Paper>
            )}
        </Box>
    );
}
