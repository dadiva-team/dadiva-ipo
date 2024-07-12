import React, { useCallback, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { ErrorAlert } from '../../../shared/ErrorAlert';
import { Role } from '../../../../session/Session';

export interface CreateUserDialogProps {
  open: boolean;
  onAnswer: (nic: string, password: string, name: string, role: string) => void;
  onClose: () => void;
}

export function CreateUserDialog({ open, onAnswer, onClose }: CreateUserDialogProps) {
  const [nic, setNic] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [role, setRole] = useState<string>(Object.keys(Role)[0]);
  const [password, setPassword] = useState<string>('');

  const [error, setError] = useState('');

  const handleCloseAndAnswer = useCallback(() => {
    if (nic.length !== 8 || /[A-Za-z]/.test(nic)) {
      setError('O nic só pode incluir numeros e e tem 8 digitos');
      return;
    }

    if (password.length <= 8) {
      setError('A password tem de ter pelo menos 8 caracteres');
      return;
    }

    onAnswer(nic, password, name, role);
    onClose();
  }, [nic, password, name, role, onAnswer, onClose, setError]);

  return (
    <Dialog onClose={onClose} open={open} aria-labelledby="create-user" maxWidth="md" fullWidth>
      <DialogTitle id="create-user">Criar Utilizador</DialogTitle>
      <IconButton
        aria-label="close"
        color="inherit"
        size="small"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: '5%',
        }}
      >
        <Close fontSize="inherit" />
      </IconButton>
      <DialogContent dividers>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <FormControl fullWidth>
            <TextField
              id="user-nic"
              value={nic}
              required
              label="Nic do utilizador"
              onChange={event => {
                setNic(event.target.value);
              }}
            />
          </FormControl>

          <FormControl fullWidth>
            <TextField
              id="username"
              value={name}
              required
              label="Nome do utilizador"
              onChange={event => {
                setName(event.target.value);
              }}
            />
          </FormControl>

          <FormControl fullWidth>
            <Select
              labelId="select-role-label"
              id="select-role"
              value={role}
              label="Role"
              onChange={event => {
                setRole(event.target.value);
              }}
            >
              {Object.keys(Role).map(role => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <TextField
              id="user-password"
              value={password}
              required
              label="Password"
              onChange={event => {
                setPassword(event.target.value);
              }}
            />
          </FormControl>

          {error && <ErrorAlert error={error} clearError={() => setError(null)} />}
          <Button
            onClick={() => {
              handleCloseAndAnswer();
            }}
          >
            Criar Utilizador
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
