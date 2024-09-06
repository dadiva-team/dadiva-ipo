import { Typography, Paper, Grid } from '@mui/material';
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
      case SuspensionType.BetweenReviewAndDonation:
        return 'Temporaria - Periodo entre revisao e dadiva';
      case SuspensionType.PendingReview:
        return 'Temporaria - Pendente de revisao';
      default:
        return 'Unknown';
    }
  };

  return (
    <>
      <Paper elevation={3} sx={{ p: 3, mt: 2, backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          <strong>O dador encontra-se suspenso</strong>
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography>
              <strong>Tipo de Suspensão:</strong> {suspensionTypeText(userSuspension.suspensionType)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography>
              <strong>Data de Início:</strong> {new Date(userSuspension.suspensionStartDate).toLocaleDateString()}
            </Typography>
          </Grid>
          {userSuspension.suspensionEndDate && (
            <Grid item xs={12} md={6}>
              <Typography>
                <strong>Data de Fim:</strong> {new Date(userSuspension.suspensionEndDate).toLocaleDateString()}
              </Typography>
            </Grid>
          )}
          {userSuspension.reason && (
            <Grid item xs={12}>
              <Typography>
                <strong>Motivo:</strong> {userSuspension.reason}
              </Typography>
            </Grid>
          )}
          {userSuspension.suspensionNote && (
            <Grid item xs={12}>
              <Typography>
                <strong>Nota:</strong> {userSuspension.suspensionNote}
              </Typography>
            </Grid>
          )}
          <Grid item xs={12} md={6}>
            <Typography>
              <strong>Suspenso pelo Médico:</strong> {userSuspension?.doctor?.name}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}
