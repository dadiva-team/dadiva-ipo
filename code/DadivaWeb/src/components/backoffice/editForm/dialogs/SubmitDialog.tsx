import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Box,
  List,
  ListItem,
} from '@mui/material';
import { FormChanges } from '../utils';
import Typography from '@mui/material/Typography';
import i18n from 'i18next';
import { ErrorAlert } from '../../../shared/ErrorAlert';

interface SubmitDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  onError?: string;
  isLoading: boolean;
  changes: FormChanges;
}

export function SubmitDialog({ open, onClose, onSubmit, onError, isLoading, changes }: SubmitDialogProps) {
  const [reason, setReason] = useState<string>('');

  const handleConfirm = () => {
    onSubmit(reason);
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="submit-dialog-title">
      <DialogTitle id="submit-dialog-title">Submeter Formulário</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="reason"
          label="Razão da alteração (opcional)"
          type="text"
          fullWidth
          variant="outlined"
          value={reason}
          onChange={e => setReason(e.target.value)}
        />
        {onError && <ErrorAlert error={onError} clearError={() => console.log(':D')} />}

        <Box mt={2}>
          {changes?.addedGroups.length > 0 && (
            <Box mb={2}>
              <Typography variant="h6" gutterBottom>
                {i18n.t('Added Groups')}
              </Typography>
              <List dense>
                {changes.addedGroups.map(group => (
                  <ListItem key={group.name} sx={{ pl: 2 }}>
                    <Typography variant="body1">{group.name}</Typography>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
          {changes?.removedGroups.length > 0 && (
            <Box mb={2}>
              <Typography variant="h6" gutterBottom>
                {i18n.t('Removed Groups')}
              </Typography>
              <List dense>
                {changes.removedGroups.map(group => (
                  <ListItem key={group.name} sx={{ pl: 2 }}>
                    <Typography variant="body1">{group.name}</Typography>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
          {changes?.modifiedGroups.length > 0 && (
            <Box mb={2}>
              <Typography variant="h6" gutterBottom>
                {i18n.t('Modified Groups')}
              </Typography>
              <List dense>
                {changes.modifiedGroups.map(({ groupName, changes }) => (
                  <ListItem key={groupName} sx={{ flexDirection: 'column', alignItems: 'flex-start', pl: 2 }}>
                    <Typography variant="body1" fontWeight="bold" gutterBottom>
                      {groupName}
                    </Typography>
                    <List dense>
                      {changes.map((change, index) => (
                        <ListItem key={index} sx={{ pl: 4 }}>
                          <Typography variant="body2">{change}</Typography>
                        </ListItem>
                      ))}
                    </List>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="primary" disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} /> : 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
