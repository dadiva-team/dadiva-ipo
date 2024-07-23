import {Alert} from "@mui/material";
import React from "react";

interface InfoAlertProps {
    actionMessage: string | null;
    type: 'info' | 'warning' | 'error' | 'success';
}

export function InfoAlert({actionMessage, type}: InfoAlertProps) {
    return (
        <>
            {actionMessage && (
                <Alert
                    severity={type}
                    sx={{mb: 2}}
                >
                    {actionMessage}
                </Alert>
            )}
        </>
    );
}