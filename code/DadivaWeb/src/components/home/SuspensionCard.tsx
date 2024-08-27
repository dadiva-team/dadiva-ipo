import { Paper } from '@mui/material';
import Typography from '@mui/material/Typography';
import React from 'react';
import { SuspensionType } from '../../services/users/models/LoginOutputModel';
import { useTranslation } from 'react-i18next';

interface SuspensionCardProps {
  suspensionType: SuspensionType;
  suspensionStartDate?: string;
  suspensionEndDate?: string;
}

export function SuspensionCard({ suspensionStartDate, suspensionEndDate, suspensionType }: SuspensionCardProps) {
  const { t } = useTranslation();
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
      {suspensionType === SuspensionType.PendingReview && (
        <>
          <Typography variant="h6" sx={{ pb: 2 }}>
            {' '}
            {t('Suspension Card Title Pending Review')}{' '}
          </Typography>
          <Typography variant="subtitle1">
            {t('Suspension Card Date Pending Review')}
            {suspensionStartDate}
          </Typography>
          <Typography component="h1" variant="body1" sx={{ pt: 1 }}>
            {t('Suspension Card Body Pending Review')}
          </Typography>
        </>
      )}
      {suspensionType === SuspensionType.BetweenBloodDonations && (
        <>
          <Typography variant="h6">{t('Suspension Card Title BetweenBloodDonations')}</Typography>
          <Typography component="h1" variant="body1" sx={{ pt: 1 }}>
            {t('Suspension Card Body BetweenBloodDonations')}
          </Typography>
          <Typography variant="subtitle1">
            {t('Suspension Card Date BetweenBloodDonations')}
            {suspensionEndDate}
          </Typography>
        </>
      )}
      {suspensionType === SuspensionType.Permanent && (
        <>
          <Typography variant="h6">{t('Suspension Card Title Permanent')}</Typography>
          <Typography component="h1" variant="body1" sx={{ pt: 1 }}>
            {t('Suspension Card Body Permanent')}
          </Typography>
        </>
      )}
      {suspensionType === SuspensionType.Other && (
        <>
          <Typography variant="h6">{t('Suspension Card Title Other')}</Typography>
          <Typography variant="subtitle1">{t('Suspension Card Body-Reason Other')}</Typography>
          <Typography component="h1" variant="body1" sx={{ pt: 1 }}>
            {t('Suspension Card Body-Contact Other')}
          </Typography>
        </>
      )}
    </Paper>
  );
}
