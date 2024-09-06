import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  IconButton,
  Box,
  CircularProgress,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface ReviewDialogProps {
  dialogOpen: boolean;
  dialogType: boolean;
  finalNote: string;
  handleDialogClose: () => void;
  handleDialogSubmit: (applySuspension: boolean, openProfileAfterReject: boolean) => void;
  setFinalNote: (note: string) => void;
  isSubmitting: boolean;
}

export function ReviewDialog({
  dialogOpen,
  dialogType,
  finalNote,
  handleDialogClose,
  handleDialogSubmit,
  setFinalNote,
  isSubmitting,
}: ReviewDialogProps) {
  const [applySuspension, setApplySuspension] = useState(false);
  const [openProfileAfterReject, setOpenProfileAfterReject] = useState(false);

  useEffect(() => {
    if (!dialogOpen) {
      setApplySuspension(false);
      setOpenProfileAfterReject(false);
    }
  }, [dialogOpen]);

  return (
    <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
      <DialogTitle>{dialogType ? 'Aprovar Submissão' : 'Rejeitar Submissão'}</DialogTitle>
      <IconButton
        aria-label="close"
        color="inherit"
        size="small"
        onClick={handleDialogClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: '5%',
        }}
      >
        <Close fontSize="inherit" />
      </IconButton>
      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            width: '100%',
          }}
        >
          {!dialogType && (
            <TextField
              autoFocus
              margin="dense"
              label="Nota Final"
              type="text"
              multiline
              rows={2}
              fullWidth
              variant="outlined"
              value={finalNote}
              onChange={e => setFinalNote(e.target.value)}
            />
          )}

          {!dialogType && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={openProfileAfterReject}
                  onChange={() => setOpenProfileAfterReject(!openProfileAfterReject)}
                />
              }
              label="Abrir o perfil do dador para suspensão"
            />
          )}

          {dialogType && (
            <FormControlLabel
              control={<Checkbox checked={applySuspension} onChange={() => setApplySuspension(!applySuspension)} />}
              label="Suspender o dador entre a revisão e a próxima doação"
            />
          )}
          {isSubmitting && <CircularProgress sx={{ display: 'block', margin: '0 auto' }} />}
          <Box display="flex" justifyContent="space-between" width="70%">
            <Button onClick={handleDialogClose}>Cancelar</Button>
            <Button onClick={() => handleDialogSubmit(applySuspension, openProfileAfterReject)}>Confirmar</Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
