import React, {useState} from 'react';
import {Box, Paper} from '@mui/material';
import {DonorSearchName} from './DoctorSearchName';
import {DonorSearchNic} from './DoctorSearchNic';
import {DoctorSearchResult} from './DoctorSearchResult';
import {handleError, handleRequest} from '../../../services/utils/fetch';
import {useNavigate} from 'react-router-dom';
import {DoctorServices} from '../../../services/doctors/DoctorServices';
import {Submission} from '../../../domain/Submission';
import {ErrorAlert} from '../../../components/shared/ErrorAlert';
import LoadingSpinner from '../../../components/shared/LoadingSpinner';
import {FormServices} from '../../../services/from/FormServices';
import {Group} from '../../../domain/Form/Form';
import {PendingSubmissionCheck} from './PendingSubmissionCheck';
import {User} from "../../../domain/User/User";

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

    const [oldSubmissions, setOldSubmissions] = useState<Submission[]>(null);
    const [user, setUser] = useState<User>(null);

    const [formGroupsCache, setFormGroupsCache] = useState<Map<number, Group[]>>(new Map());
    const [formCheck, setFormCheck] = useState<boolean>(null);

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
        const [error, res] = await handleRequest(DoctorServices.getPendingSubmissionByNic(Number(user.nic)));
        if (error) {
            handleError(error, setErrorSubmission, nav);
            setPendingSubmission(null);
            return;
        }
        await fetchFormGroups(res.formVersion);
        setPendingSubmission(res as Submission);
        setFormCheck(true);
    };

    const fetchSubmissionHistory = async (limit: number, skip: number) => {
        if (!user) return;
        const [error, res] = await handleRequest(DoctorServices.getSubmissionHistoryByNic(Number(user.nic), limit, skip));
        if (error) {
            handleError(error, setErrorSubmission, nav);
            setOldSubmissions([]);
            return;
        }
        console.log(res);
        /*const submissions = await Promise.all(res.map(async (submission: Submission) => {
            const formGroups = await fetchFormGroups(submission.formVersion);
            return {...submission, formGroups};
        }));*/
        setOldSubmissions(res as Submission[]);
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
                        onCheckPendingSubmission={fetchPendingSubmission}
                        onCheckOldSubmissions={() => fetchSubmissionHistory(10, 0)}  //TODO: Tirar o hardcode do limit e skip

                        //TODO: Alterar os botões para fazer mais um pedido à API ou simplesmente mostrar os resultados entre os 2 modos

                    />
                    {errorSubmission &&
                        <ErrorAlert error={errorSubmission} clearError={() => setErrorSubmission(null)}/>
                    }
                    {formCheck && pendingSubmission && (
                        <Box sx={{marginLeft: 1, width: '80%'}}>

                            <PendingSubmissionCheck
                                formGroups={formGroupsCache.get(pendingSubmission.formVersion) || []}
                                submission={pendingSubmission}
                            />
                        </Box>
                    )}
                    {oldSubmissions && (
                        <Box sx={{marginLeft: 1, width: '80%'}}>

                        </Box>
                        //TODO: Adicionar componente para mostrar submissões antigas
                        //TODO: Adicionar botão para carregar mais submissões antigas (skip + limit)
                    )}

                </Paper>
            )}
        </Box>
    );
}
