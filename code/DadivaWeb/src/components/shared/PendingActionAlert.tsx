import {Alert, IconButton} from "@mui/material";
import {Close} from "@mui/icons-material";
import React from "react";

interface PendingActionAlertProps {
    actionMessage: string | null;
    clearActionMessage: () => void;
}

export function PendingActionAlert({actionMessage, clearActionMessage}: PendingActionAlertProps) {
    return (
        <>
            {actionMessage && (
                <Alert
                    action={
                        <IconButton aria-label="close" color="inherit" size="small" onClick={clearActionMessage}>
                            <Close fontSize="inherit"/>
                        </IconButton>
                    }
                    severity="info"
                    sx={{mb: 2}}
                >
                    {actionMessage}
                </Alert>
            )}
        </>
    );
}