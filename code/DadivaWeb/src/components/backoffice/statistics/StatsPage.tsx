import React, { useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { FormServices } from '../../../services/from/FormServices';
import Typography from '@mui/material/Typography';
import { Box, Card, CardContent, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { BarChart } from '@mui/x-charts/BarChart';
import LoadingSpinner from '../../shared/LoadingSpinner';
import { ErrorAlert } from '../../shared/ErrorAlert';

export interface DailySubmissionStats {
  date: string;
  total: number;
  approved: number;
  denied: number;
}

export function StatsPage() {
  const { t } = useTranslation();
  const [startUnix, setStartUnix] = React.useState<Dayjs>(dayjs(Date.now()).subtract(7, 'days'));
  const [endUnix, setEndUnix] = React.useState<Dayjs>(dayjs(Date.now()));
  const [data, setData] = React.useState<DailySubmissionStats[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  // Chart data
  const [total, setTotal] = useState(0);
  const [approved, setApproved] = useState(0);
  const [denied, setDenied] = useState(0);
  const [pending, setPending] = useState(0);
  const [xLabels, setXLabels] = useState<string[]>([]);
  const [approvedData, setApprovedData] = useState<number[]>([]);
  const [deniedData, setDeniedData] = useState<number[]>([]);
  const [pendingData, setPendingData] = useState<number[]>([]);

  useEffect(() => {
    if (!endUnix.isBefore(startUnix)) {
      FormServices.getSubmissionsStats(startUnix.valueOf(), endUnix.add(1, 'day').valueOf()).then(response => {
        setData(response);
      });
    }
  }, [startUnix, endUnix]);

  useEffect(() => {
    if (data && data.length > 0) {
      const total = data.reduce((sum, d) => sum + d.total, 0) || 0;
      const approved = data.reduce((sum, d) => sum + d.approved, 0) || 0;
      const denied = data.reduce((sum, d) => sum + d.denied, 0) || 0;
      const pending = total - approved - denied || 0;

      setTotal(total);
      setApproved(approved);
      setDenied(denied);
      setPending(pending);

      // Map data for the bar chart
      const formattedXLabels = data.map(d => dayjs(d.date).format('DD.MM'));
      const approvedData = data.map(d => d.approved || 0);
      const deniedData = data.map(d => d.denied || 0);
      const pendingData = data.map(d => d.total - d.approved - d.denied || 0);

      setXLabels(formattedXLabels);
      setApprovedData(approvedData);
      setDeniedData(deniedData);
      setPendingData(pendingData);
    }
  }, [data]);

  return (
    <>
      {!data || data.length === 0 ? (
        <Box sx={{ mt: 1 }}>
          <LoadingSpinner text={t('Loading Questions')} />
          <ErrorAlert error={error} clearError={() => setError(null)} />
        </Box>
      ) : (
        <>
          <Typography variant="h5" sx={{ mb: 5 }}>
            {t('Statistics')}
          </Typography>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={t('Start')}
              value={startUnix}
              onChange={newValue => setStartUnix(newValue)}
              maxDate={dayjs(Date.now())}
            />
            <DatePicker
              label={t('End')}
              value={endUnix}
              onChange={newValue => setEndUnix(newValue)}
              minDate={startUnix}
              maxDate={dayjs(Date.now())}
            />
          </LocalizationProvider>

          <Grid container spacing={2} paddingTop={5}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ border: 1, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6">{t('Submissions')}</Typography>
                  <Typography variant="h4">{total}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ backgroundColor: '#90ee90', border: 1, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6">{t('Approved')}</Typography>
                  <Typography variant="h4">{approved}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ backgroundColor: '#ffcccb', border: 1, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6">{t('Denied')}</Typography>
                  <Typography variant="h4">{denied}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ backgroundColor: '#d3d3d3', border: 1, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6">{t('Pending')}</Typography>
                  <Typography variant="h4">{pending}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Typography variant="h6" sx={{ mt: 6 }}>
            {t('Submission Graph')}
          </Typography>
          <Box sx={{ mt: 2, border: 1, width: '50%' }}>
            <BarChart
              height={300}
              series={[
                { data: approvedData, label: 'Aprovadas', stack: 'stack1', color: '#90ee90' },
                { data: deniedData, label: 'Rejeitadas', stack: 'stack1', color: '#ffcccb' },
                { data: pendingData, label: 'Pendentes', color: '#d3d3d3' },
              ]}
              xAxis={[
                {
                  data: xLabels,
                  scaleType: 'band',
                  tickLabelPlacement: 'middle',
                },
              ]}
            />
          </Box>
        </>
      )}
    </>
  );
}
