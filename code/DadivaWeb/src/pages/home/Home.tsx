import React from 'react';
import { Box, Button, Paper } from '@mui/material';
import { PreDadivaInfoCard } from '../../components/home/PreDadivaInfoCard';
import { useNavigate } from 'react-router-dom';
import { Uris } from '../../utils/navigation/Uris';
import { Role, useCurrentSession } from '../../session/Session';
import { PreDadivaLoginCard } from '../../components/home/PreDadivaLoginCard';
import { useTranslation } from 'react-i18next';
import { SuspensionCard } from '../../components/home/SuspensionCard';
import Typography from '@mui/material/Typography';

export default function Home() {
  const user = useCurrentSession();
  const { t } = useTranslation();
  const nav = useNavigate();

  const isAdmin = user?.perms?.includes(Role.ADMIN);
  const isDoctor = user?.perms?.includes(Role.DOCTOR);
  const isDonor = user?.perms?.includes(Role.DONOR);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        mt: 4,
        mb: 4,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
      }}
    >
      {!user && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography variant="h3" component="h1" gutterBottom>
            {t('Welcome to DADIVA IPO')}
          </Typography>
          <Typography variant="body1" gutterBottom sx={{ mb: 10 }}>
            {t('Your journey towards making a difference starts here')}
          </Typography>
          <PreDadivaLoginCard />
        </Box>
      )}

      {(isAdmin || isDoctor) && (
        <Paper
          sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '40%',
            elevation: 16,
            justifyContent: 'space-between',
            border: 1,
            borderRadius: 2,
          }}
        >
          <Typography variant="h5" component="h2" gutterBottom>
            {isAdmin ? t('Admin Dashboard') : t('Doctor Dashboard')}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => nav(isAdmin ? Uris.BACKOFFICE : Uris.DOCTOR)}
            fullWidth
          >
            {isAdmin ? t('Go to Backoffice') : t('Go to Doctor Page')}
          </Button>
        </Paper>
      )}

      {!isAdmin && !isDoctor && isDonor && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            mt: 10,
          }}
        >
          {user?.accountStatus?.isActive ? (
            <>
              <SuspensionCard
                suspensionType={user.accountStatus.type}
                suspensionStartDate={new Date(user.accountStatus.startDate).toLocaleDateString()}
                suspensionEndDate={new Date(user.accountStatus.endDate).toLocaleDateString()}
              />
            </>
          ) : (
            <PreDadivaInfoCard />
          )}
        </Box>
      )}
    </Box>
  );
}
