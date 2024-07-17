import React from 'react';
import {Box} from '@mui/material';
import {PreDadivaInfoCard} from '../../components/home/PreDadivaInfoCard';
import {useNavigate} from 'react-router-dom';
import {Uris} from '../../utils/navigation/Uris';
import {Role, useAccountStatus, useCurrentSession, useSessionManager} from '../../session/Session';
import {PreDadivaLoginCard} from '../../components/home/PreDadivaLoginCard';
import {PendingReviewCard} from '../../components/home/PendingReviewCard';
import {useTranslation} from 'react-i18next';
import {AccountStatus} from "../../services/users/models/LoginOutputModel";
import BACKOFFICE = Uris.BACKOFFICE;
import DOCTOR = Uris.DOCTOR;
import {SupensionCard} from "../../components/home/SuspensionCard";

export default function Home() {
  const nav = useNavigate();
  const user = useCurrentSession();
  const sessionManager = useSessionManager();
  const accountStatus = useAccountStatus();
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
      {(!user || user.perms == Role.ADMIN) && (
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
      {(!user || user.perms == Role.DOCTOR || user.perms == Role.ADMIN) && (
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
              (() => {
                  switch (accountStatus.status) {
                      case AccountStatus.PendingReview:
                          return (
                              <PendingReviewCard
                                  submissionDate={new Date(user.accountStatus.lastSubmissionDate).toLocaleDateString()}
                              />
                          );
                      case AccountStatus.Suspended:
                            return (
                                <SupensionCard
                                    suspensionDate={new Date(user.accountStatus.suspendedUntil).toLocaleDateString()}
                                />
                            );
                      default:
                          return <PreDadivaInfoCard />;
                  }
              })()
          ) : (
              <PreDadivaLoginCard />
          )}
      </Box>
    </div>
  );
}
