import React, {useEffect, useState} from 'react';
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
import {FormCheck} from './FormCheck';
import {User} from "../../../domain/User/User";

export interface DoctorSearchProps {
    mode: string;
}

export function DoctorSearch({mode}: DoctorSearchProps) {
    const [errorForm, setErrorForm] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const nav = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [nic, setNic] = useState<string>('');
    const [submission, setSubmissions] = useState<Submission>(null);
    const [user, setUser] = useState<User>(null);
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
        const [error, res] = await handleRequest(DoctorServices.getUserByNic(Number(nic)));

        if (error) {
            handleError(error, setError, nav);
            setSubmissions(null);
            setUser(null);
            return;
        }

        setUser({name: res.name, nic: res.nic.toString()});
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
                        handleSearch={() => fetch().then(() => setIsLoading(false))}
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
                        onCheckPendingSubmission={() => {
                            setFormCheck(!formCheck);
                        }}
                        onCheckOldSubmissions={() => {
                            console.log('old');
                        }}
                    />
                    {formCheck && (
                        <Box sx={{marginLeft: 1, width: '80%'}}>
                            <FormCheck formGroups={formGroups} submission={submission}/>
                        </Box>
                    )}
                </Paper>
            )}
        </Box>
    );
}
