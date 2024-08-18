import React from 'react';
import { Box } from '@mui/material';
import { PreDadivaInfoCard } from '../../components/home/PreDadivaInfoCard';
import { useNavigate } from 'react-router-dom';
import { Uris } from '../../utils/navigation/Uris';
import { Role, useCurrentSession, useSessionManager } from '../../session/Session';
import { PreDadivaLoginCard } from '../../components/home/PreDadivaLoginCard';
import { useTranslation } from 'react-i18next';
import BACKOFFICE = Uris.BACKOFFICE;
import DOCTOR = Uris.DOCTOR;
import { SuspensionCard } from '../../components/home/SuspensionCard';

export default function Home() {
  const nav = useNavigate();
  const user = useCurrentSession();
  const sessionManager = useSessionManager();
  const { t } = useTranslation();

  return (
    <div>
      <h1>DEMO</h1>
      {user && (
        <button
          type="button"
          value="Clear Session"
          onClick={() => {
            sessionManager.clearSession();
          }}
          style={{ display: 'block', marginBottom: '10px' }}
        >
          Clear Session
        </button>
      )}
      {(!user || (Array.isArray(user?.perms) && user.perms.find(r => r == Role.ADMIN))) && (
        <button
          type="button"
          value="Go to Backoffice"
          onClick={() => {
            nav(BACKOFFICE);
          }}
          style={{ display: 'block', marginBottom: '10px' }}
        >
          {t('Backoffice')}
        </button>
      )}
      {(!user || (Array.isArray(user?.perms) && user.perms.find(r => r == Role.ADMIN || r == Role.DOCTOR))) && (
        <button
          type="button"
          value="Go to Doctor page"
          onClick={() => {
            nav(DOCTOR);
          }}
          style={{ display: 'block', marginBottom: '10px' }}
        >
          {t('Doctor Page')}
        </button>
      )}
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
        {user ? (
          user?.accountStatus?.isActive ? (
            <SuspensionCard
              suspensionType={user.accountStatus.type}
              suspensionStartDate={new Date(user.accountStatus.startDate).toLocaleDateString()}
              suspensionEndDate={new Date(user.accountStatus.endDate).toLocaleDateString()}
            />
          ) : (
            <PreDadivaInfoCard />
          )
        ) : (
          <PreDadivaLoginCard />
        )}
      </Box>
    </div>
  );
}
