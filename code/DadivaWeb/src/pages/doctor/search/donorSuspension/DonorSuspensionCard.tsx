import { Box, Typography } from '@mui/material';
import { UserSuspension } from '../../../../domain/User/UserSuspension';
import React from 'react';
import { SuspensionType } from '../../../../services/users/models/LoginOutputModel';

interface DonorSuspensionCard {
  userSuspension: UserSuspension;
}

export function DonorSuspensionCard({ userSuspension }: DonorSuspensionCard) {
  const suspensionTypeText = (type: SuspensionType) => {
    switch (type) {
      case SuspensionType.Permanent:
        return 'Permanente';
      case SuspensionType.BetweenBloodDonations:
        return 'Temporaria - Periodo entre dadivas';
      case SuspensionType.Other:
        return 'Temporaria - Periodo de tempo especifico';
      default:
        return 'Unknown';
    }
  };

  return (
    <Box sx={{ gap: 1 }}>
      <Typography sx={{ pb: 1 }}>
        <strong>O dador encontra-se suspenso</strong>{' '}
      </Typography>
      <Typography>Tipo de Suspensão: {suspensionTypeText(userSuspension.suspensionType)}</Typography>
      <Typography>Data de Início: {new Date(userSuspension.suspensionStartDate).toLocaleDateString()}</Typography>
      {userSuspension.suspensionEndDate && (
        <Typography>Data de fim: {new Date(userSuspension.suspensionEndDate).toLocaleDateString()}</Typography>
      )}
      {userSuspension.reason && <Typography>Motivo: {userSuspension.reason}</Typography>}
      {userSuspension.suspensionNote && <Typography>Nota: {userSuspension.suspensionNote}</Typography>}
      <Typography>Suspenso pelo Medico/Amin com o NIC: {userSuspension.suspendedBy}</Typography>
    </Box>
  );
}
