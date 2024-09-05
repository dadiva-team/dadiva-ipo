import * as React from 'react';
import { Box, Button, Container } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useTerms } from '../../components/form/useTerms';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { ErrorAlert } from '../../components/shared/ErrorAlert';
import { useTranslation } from 'react-i18next';

export function Terms() {
  const { isLoading, error, setError, terms, nav } = useTerms();
  const { t } = useTranslation();
  return (
    <div>
      {isLoading ? (
        <Box sx={{ mt: 1 }}>
          <LoadingSpinner text={t('Loading Terms')} />
          <ErrorAlert error={error} clearError={() => setError(null)} />
        </Box>
      ) : (
        <Container maxWidth="lg">
          <div dangerouslySetInnerHTML={{ __html: terms }} /*TODO: just a proof of concept, sanitize the HTML*/ />

          <Button
            variant="contained"
            onClick={() => {
              nav('/form');
            }}
            startIcon={<NavigateNextIcon />}
            sx={{ borderRadius: 50 }}
          >
            {t('Accept Terms')}
          </Button>
        </Container>
      )}
    </div>
  );
}
