import {Box, Typography} from "@mui/material";
import {SuspensionType, UserSuspension} from "../../../../domain/User/UserSuspension";
import React from "react";

interface DonorSuspensionCard {
    userSuspension: UserSuspension;
}

export function DonorSuspensionCard({userSuspension}: DonorSuspensionCard) {
    const suspensionTypeText = (type: SuspensionType) => {
        switch(type) {
            case SuspensionType.Permanent:
                return "Permanente";
            case SuspensionType.BetweenDonations:
                return "Temporaria - Periodo entre dadivas";
            case SuspensionType.Other:
                return "Temporaria - Periodo de tempo especifico";
            default:
                return "Unknown";
        }
    };

    return (
        <Box sx={{gap: 1}}>
            <Typography sx={{pb: 1}} ><strong>O dador já se encontra suspenso</strong> </Typography>
            <Typography>Tipo de Suspensão: {suspensionTypeText(userSuspension.suspensionType)}</Typography>
            <Typography>Data de Início: {new Date(userSuspension.suspensionStartDate).toLocaleDateString()}</Typography>
            {userSuspension.suspensionEndDate && (
                <Typography>Data de fim: {new Date(userSuspension.suspensionEndDate).toLocaleDateString()}</Typography>
            )}
            {userSuspension.reason && (
                <Typography>Motivo: {userSuspension.reason}</Typography>
            )}
            {userSuspension.suspensionNote && (
                <Typography>Nota: {userSuspension.suspensionNote}</Typography>
            )}
            <Typography>Suspenso pelo Medico/Amin com o NIC: {userSuspension.suspendedBy}</Typography>
        </Box>
    );
}