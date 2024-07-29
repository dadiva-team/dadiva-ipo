import {Paper} from '@mui/material';
import Typography from '@mui/material/Typography';
import React from 'react';

interface SupensionCardCardProps {
    suspensionDate?: string;
}

export function SupensionCard({suspensionDate}: SupensionCardCardProps) {
    return (
        <Paper
            sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '40%',
                elevation: 16,
                justifyContent: 'space-between',
            }}
        >
            {suspensionDate ?
                <Typography variant="h6">Tem uma suspenção permanente</Typography> :
                <Typography variant="h6">Tem uma suspenção temporaria</Typography>
            }
            {suspensionDate && <Typography variant="subtitle1">Data final da suspensão: {suspensionDate}</Typography>}
            <Typography component="h1" variant="body1" sx={{pt: 1}}>
                Por favor aguarde até que a suspensão termine para subemeter um novo formulario
            </Typography>
        </Paper>
    );
}
