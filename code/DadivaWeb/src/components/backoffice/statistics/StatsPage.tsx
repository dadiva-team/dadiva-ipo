import React, { useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { FormServices } from '../../../services/from/FormServices';
import Typography from '@mui/material/Typography';
import LoadingSpinner from '../../shared/LoadingSpinner';
import { Box, Card, CardContent, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next'; // Import useTranslation

export interface SubmissionStats {
  total: number;
  approved: number;
  denied: number;
}

export function StatsPage() {
  const { t } = useTranslation();
  const [startUnix, setStartUnix] = React.useState<Dayjs>(dayjs(Date.now()).subtract(7, 'days'));
  const [endUnix, setEndUnix] = React.useState<Dayjs>(dayjs(Date.now()));
  const [data, setData] = React.useState<SubmissionStats | null>(null);

  useEffect(() => {
    if (!endUnix.isBefore(startUnix)) {
      FormServices.getSubmissionsStats(startUnix.valueOf(), endUnix.add(1, 'day').valueOf()).then(response => {
        setData(response);
      });
    }
  }, [startUnix, endUnix]);

  return (
    <>
      <Typography variant="h5" sx={{ mb: 5 }}>
        {t('Statistics')}
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label={t('Start')}
          value={startUnix}
          defaultValue={startUnix}
          onChange={newValue => setStartUnix(newValue)}
          maxDate={dayjs(Date.now())}
        />
        <DatePicker
          label={t('End')}
          value={endUnix}
          defaultValue={endUnix}
          onChange={newValue => setEndUnix(newValue)}
          minDate={startUnix}
          maxDate={dayjs(Date.now())}
        />
      </LocalizationProvider>
      {data == null ? (
        <Box sx={{ mt: 1 }}>
          <LoadingSpinner text={t('Loading Questions')} />
        </Box>
      ) : (
        <>
          <Grid container spacing={2} paddingTop={5}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{t('Submissions')}</Typography>
                  <Typography variant="h4">{data.total}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{t('Approved')}</Typography>
                  <Typography variant="h4">{data.approved}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{t('Denied')}</Typography>
                  <Typography variant="h4">{data.denied}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{t('Pending')}</Typography>
                  <Typography variant="h4">{data.total - data.approved - data.denied}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
}
