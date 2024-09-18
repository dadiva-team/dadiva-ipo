import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { UserSuspension } from '../../../../domain/User/UserSuspension';
import { handleError, handleRequest } from '../../../../services/utils/fetch';
import { DoctorServices } from '../../../../services/doctors/DoctorServices';
import { SuspendUserRequestModel } from '../../../../services/doctors/models/SuspendeUserRequestModel';
import { useCurrentSession } from '../../../../session/Session';
import { useNavigate } from 'react-router-dom';
import { ErrorAlert } from '../../../../components/shared/ErrorAlert';
import { DonorSuspensionCard } from './DonorSuspensionCard';
import { SuspensionType } from '../../../../services/users/models/LoginOutputModel';

interface DonorSuspensionProps {
  nic: string;
  fetchedSuspension?: UserSuspension;
  onSubmittedSuccessfully: () => void;
}

export function DonorSuspension({ nic, fetchedSuspension, onSubmittedSuccessfully }: DonorSuspensionProps) {
  const doctor = useCurrentSession();
  const nav = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const [suspensionType, setSuspensionType] = useState<SuspensionType | null>(null);
  const [months, setMonths] = useState<string>('');
  const [reason, setReason] = useState('');

  const today = new Date().toISOString();
  const [suspensionStartDateToday, setSuspensionStartDateToday] = useState<boolean>(true);
  const [suspensionStartDate, setSuspensionStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [suspensionEndDate, setSuspensionEndDate] = useState('');
  const [duration, setDuration] = useState<number>(0);

  const [isEditing, setIsEditing] = useState(false);

  const submitSuspension = async () => {
    const request = {
      userNic: Number(nic),
      suspensionType: suspensionType,
      suspensionStartDate: suspensionStartDate,
      suspensionEndDate: suspensionEndDate,
      reason: reason,
      suspendedBy: doctor.nic,
    } as SuspendUserRequestModel;
    const [error, res] = await handleRequest(DoctorServices.suspendUser(request));
    if (error) {
      handleError(error, setError, nav);
    } else {
      console.log(res);
      onSubmittedSuccessfully();
    }
  };

  const calculateSuspensionEndDate = (months: number) => {
    const startDate = new Date(suspensionStartDate);
    startDate.setMonth(startDate.getMonth() + months);
    setSuspensionEndDate(startDate.toISOString().split('T')[0]);
  };

  useEffect(() => {
    const calculateDuration = () => {
      const startDate = new Date(suspensionStartDate);
      const endDate = new Date(suspensionEndDate);
      const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      setDuration(duration);
    };

    if (suspensionStartDateToday) {
      setSuspensionStartDate(today.split('T')[0]);
    }

    if (suspensionStartDate && suspensionEndDate) {
      calculateDuration();
    }

    if (suspensionType === SuspensionType.Permanent) {
      setSuspensionEndDate(null);
    }
  }, [suspensionStartDate, suspensionEndDate, today, suspensionStartDateToday, suspensionType]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {fetchedSuspension && (
        <Box sx={{ mb: 1 }}>
          <DonorSuspensionCard userSuspension={fetchedSuspension} />
          <Button variant="contained" color="primary" onClick={() => setIsEditing(!isEditing)} sx={{ mt: 3 }}>
            {!isEditing ? 'Editar Suspensão' : 'Cancelar Edição'}
          </Button>
        </Box>
      )}
      {!fetchedSuspension || isEditing ? (
        <>
          {error && <ErrorAlert error={error} clearError={() => setError(null)} />}
          <Typography>
            <strong>{isEditing ? 'Editar Suspensão' : 'Suspender Dador'} </strong>
          </Typography>
          <FormControl>
            <FormLabel>Tipo de suspensão</FormLabel>
            <RadioGroup
              row
              onChange={e => {
                setMonths('');
                setDuration(0);
                setSuspensionStartDate(today.split('T')[0]);
                setSuspensionEndDate('');
                setSuspensionType(e.target.value as SuspensionType);
              }}
            >
              <FormControlLabel
                value={SuspensionType.BetweenBloodDonations}
                control={<Radio />}
                label="Entre Dadivas"
              />
              <FormControlLabel value={SuspensionType.Permanent} control={<Radio color="error" />} label="Permanente" />
              <FormControlLabel value={SuspensionType.Other} control={<Radio />} label="Outro" />
            </RadioGroup>
          </FormControl>

          {suspensionType === SuspensionType.BetweenBloodDonations && (
            <FormControl sx={{ width: '50%' }}>
              <InputLabel>Duração</InputLabel>
              <Select
                value={months}
                onChange={e => {
                  setMonths(e.target.value);
                  calculateSuspensionEndDate(Number(e.target.value));
                }}
                label="Duração"
                required
              >
                <MenuItem value="3">3 Meses</MenuItem>
                <MenuItem value="4">4 Meses</MenuItem>
              </Select>
            </FormControl>
          )}

          {suspensionType === SuspensionType.Other && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                <FormControl sx={{ width: '15%' }}>
                  <InputLabel>Inicio</InputLabel>
                  <Select
                    value={suspensionStartDateToday ? 'today' : 'other'}
                    onChange={e => {
                      setSuspensionStartDateToday(e.target.value === 'today');
                    }}
                    label="Duration"
                    required
                  >
                    <MenuItem value="today">Hoje</MenuItem>
                    <MenuItem value="other">Custom</MenuItem>
                  </Select>
                </FormControl>
                {!suspensionStartDateToday && (
                  <TextField
                    label="Inicio"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={suspensionStartDate}
                    onChange={e => setSuspensionStartDate(e.target.value)}
                  />
                )}
                <TextField
                  label="Fim"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={suspensionEndDate}
                  onChange={e => setSuspensionEndDate(e.target.value.split('T')[0])}
                  required
                />
              </Box>
              <TextField
                sx={{ width: '70%' }}
                multiline={true}
                rows={2}
                label="Motivo"
                value={reason}
                onChange={e => setReason(e.target.value)}
                required
              />
            </Box>
          )}

          {suspensionType === SuspensionType.Permanent && (
            <TextField
              sx={{ width: '70%' }}
              multiline={true}
              rows={3}
              label="Motivo"
              value={reason}
              onChange={e => setReason(e.target.value)}
              required
            />
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {suspensionStartDate && suspensionEndDate && (
              <>
                <Typography>Data de inicio: {suspensionStartDate}</Typography>
                <Typography>→</Typography>
              </>
            )}
            {suspensionEndDate && <Typography>Data do fim: {suspensionEndDate}</Typography>}
          </Box>

          {suspensionStartDate && suspensionEndDate && duration >= 0 && (
            <Typography>Duração: {duration} dia(s)</Typography>
          )}

          <Button
            disabled={
              !suspensionStartDate ||
              (suspensionType !== SuspensionType.Permanent && !suspensionEndDate) ||
              (suspensionType !== SuspensionType.Permanent && duration <= 0) ||
              (suspensionType !== SuspensionType.BetweenBloodDonations && reason.length === 0)
            }
            onClick={submitSuspension}
            sx={{ color: 'error' }}
          >
            Suspender
          </Button>
        </>
      ) : null}
    </Box>
  );
}
