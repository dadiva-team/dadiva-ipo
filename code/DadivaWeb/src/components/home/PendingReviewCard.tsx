import {Paper} from '@mui/material';
import Typography from '@mui/material/Typography';
import React from 'react';

interface PendingReviewCardProps {
    submissionDate: string;

}

export function PendingReviewCard({submissionDate}: PendingReviewCardProps) {
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
            <Typography component="h1" variant="body1">
                Tem uma submissão pendente de revisão.
            </Typography>
            <Typography component="p" variant="body2">
                Data de submissão: {submissionDate}
            </Typography>
        </Paper>
    );
}
