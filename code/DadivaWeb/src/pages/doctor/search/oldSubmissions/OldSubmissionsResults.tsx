import React from 'react';
import {Box, Button, Typography} from "@mui/material";
import {SubmissionHistory} from "../../../../domain/Submission/SubmissionHistory";
import {OldSubmissionCard} from "./OldSubmissionCard";

interface OldSubmissionsPendingProps {
    submissions: SubmissionHistory[];
    loadMoreSubmissions: () => void;
    hasMoreSubmissions: boolean;
}

export function OldSubmissionsResults({submissions, loadMoreSubmissions, hasMoreSubmissions}: OldSubmissionsPendingProps) {
    //TODO: Melhorar isto td xD
    return (
        <Box>
            <Typography variant="h6">Submissões Antigas</Typography>
            {submissions.map((submission, index) => (
                <Box key={index}>
                    <OldSubmissionCard submission={submission}/>
                </Box>
            ))}
            {hasMoreSubmissions ? (
                <Button onClick={loadMoreSubmissions} variant="contained" sx={{ mt: 2 }}>
                    Carregar mais
                </Button>
            ) : (
                <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                    Não há mais submissões.
                </Typography>
            )}
        </Box>
    )
}

