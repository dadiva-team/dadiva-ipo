import { Form } from '../../../domain/Form/Form';
import { Box, IconButton, Modal, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import React from 'react';
import { Group } from './Group';

interface FormShowModalProps {
  form: Form;
  openModal: boolean;
  handleCloseModal: () => void;
}

export function FormShowModal({ form, openModal, handleCloseModal }: FormShowModalProps) {
  return (
    <Box>
      <Modal
        open={!!openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            width: '70%',
            bgcolor: 'background.paper',
            p: 4,
            margin: 'auto',
            marginTop: '2%',
            maxHeight: '85vh',
            overflow: 'auto',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', pb: 1 }}>
            <Typography variant="h6">Formulário</Typography>
            <IconButton aria-label="close" color="inherit" size="small" onClick={handleCloseModal}>
              <Close fontSize="inherit" />
            </IconButton>
          </Box>
          {form.groups.map(group => (
            <Group group={group} key={group.name} />
          ))}
        </Box>
      </Modal>
    </Box>
  );
}
