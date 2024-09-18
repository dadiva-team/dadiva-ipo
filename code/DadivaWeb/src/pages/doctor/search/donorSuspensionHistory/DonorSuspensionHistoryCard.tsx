import React from 'react';
import { Typography, Paper } from '@mui/material';
import { UserSuspension } from '../../../../domain/User/UserSuspension';
import { SuspensionType } from '../../../../services/users/models/LoginOutputModel';

interface DonorSuspensionHistoryCardProps {
  suspension: UserSuspension;
  isLastSuspension: boolean;
}

export function DonorSuspensionHistoryCard({ suspension, isLastSuspension }: DonorSuspensionHistoryCardProps) {
  const { suspensionType, suspensionStartDate, suspensionEndDate, reason, suspensionNote, doctor, isActive } =
    suspension;

  const suspensionTypeText = () => {
    switch (suspensionType) {
      case SuspensionType.Permanent:
        return 'Permanente';
      case SuspensionType.BetweenBloodDonations:
        return 'Temporária - Período entre doações de sangue';
      case SuspensionType.Other:
        return 'Temporária - Período de tempo específico';
      case SuspensionType.BetweenReviewAndDonation:
        return 'Temporária - Período entre revisão e doação';
      case SuspensionType.PendingReview:
        return 'Temporária - Pendente de revisão';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <Paper
      sx={{
        p: 2,
        mb: isLastSuspension ? 0 : 2,
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'grey.300',
        borderRadius: 2,
      }}
      elevation={2}
    >
      <Typography variant="subtitle1">
        <strong>Tipo de Suspensão:</strong> {suspensionTypeText()}
      </Typography>
      <Typography variant="body2">
        <strong>Data de Início:</strong> {new Date(suspensionStartDate).toLocaleDateString()}
      </Typography>
      {suspensionEndDate && (
        <Typography variant="body2">
          <strong>Data de Fim:</strong> {new Date(suspensionEndDate).toLocaleDateString()}
        </Typography>
      )}
      <Typography variant="body2">
        <strong>Estado:</strong> {isActive ? 'Ativo' : 'Inativo'}
      </Typography>

      {reason && (
        <Typography variant="body2">
          <strong>Motivo:</strong> {reason}
        </Typography>
      )}
      {suspensionNote && (
        <Typography variant="body2">
          <strong>Nota:</strong> {suspensionNote}
        </Typography>
      )}
      {doctor && (
        <Typography variant="body2">
          <strong>Suspenso pelo Médico:</strong> {doctor.name}
        </Typography>
      )}
    </Paper>
  );
}
