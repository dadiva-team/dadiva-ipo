import React, { useEffect } from 'react';
import { Box, Button, Dialog, DialogContent, DialogTitle, FormControl, IconButton, TextField } from '@mui/material';
import { Close } from '@mui/icons-material';
import { Group } from '../../domain/Form/Form';

export interface GroupEditDialogProps {
  open: boolean;
  group: Group;
  onAnswer: (newName: string) => void;
  onClose: () => void;
}

export function GroupEditDialog({ open, group, onAnswer, onClose }: GroupEditDialogProps) {
  const [groupName, setGroupName] = React.useState(group?.name ?? '');

  useEffect(() => {
    if (group) {
      setGroupName(group.name);
    }
  }, [group]);

  const handleCloseAndAnswer = React.useCallback(() => {
    onAnswer(groupName);
    onClose();
  }, [onAnswer, groupName, onClose]);

  return (
    <Dialog onClose={onClose} open={open} aria-labelledby="edit-dialog-title" maxWidth="md" fullWidth>
      <DialogTitle id="edit-dialog-title">Editar Grupo</DialogTitle>
      <IconButton
        aria-label="close"
        color="inherit"
        size="small"
        onClick={() => onClose()}
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
              id="demo-simple-textfield"
              value={groupName}
              label="Nome do Grupo"
              onChange={event => {
                setGroupName(event.target.value);
              }}
            />
          </FormControl>
          <Button
            onClick={() => {
              handleCloseAndAnswer();
            }}
          >
            Save
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
