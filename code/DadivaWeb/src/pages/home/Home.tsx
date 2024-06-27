import React from 'react';
import {Box} from '@mui/material';
import {PreDadivaInfoCard} from '../../components/home/PreDadivaInfoCard';
import {useNavigate} from 'react-router-dom';
import {Uris} from '../../utils/navigation/Uris';
import BACKOFFICE = Uris.BACKOFFICE;
import DOCTOR = Uris.DOCTOR;
import {Role, useCurrentSession} from '../../session/Session';

export default function Home() {
    const nav = useNavigate();
    const user = useCurrentSession();
    return (
        <div>
            <h1>DEMO</h1>
            {user && (
                <button
                    type="button"
                    value="Clear Session"
                    onClick={() => {
                        sessionStorage.clear();
                        window.location.reload();
                    }}
                    style={{display: 'block', marginBottom: '10px'}}
                >
                    Clear Session
                </button>
            )}
            {(!user || user.perms == Role.ADMIN) && (
                <button
                    type="button"
                    value="Go to Backoffice"
                    onClick={() => {
                        nav(BACKOFFICE);
                    }}
                    style={{display: 'block', marginBottom: '10px'}}
                >
                    BACK OFFICE
                </button>
            )}
            {(!user || user.perms == Role.DOCTOR || user.perms == Role.ADMIN) && (
                <button
                    type="button"
                    value="Go to Doctor page"
                    onClick={() => {
                        nav(DOCTOR);
                    }}
                    style={{display: 'block', marginBottom: '10px'}}
                >
                    DOCTOR PAGE
                </button>
            )}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    mt: 4,
                    mb: 4,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                }}
            >
                {/*loggedIn ? <PreDadivaInfoCard/> : <PreDadivaLoginCard/>*/ <PreDadivaInfoCard/>}
            </Box>
        </div>
    );
}
