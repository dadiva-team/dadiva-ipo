import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    Typography,
    IconButton, Box, CircularProgress
} from '@mui/material';
import {Close} from "@mui/icons-material";

interface ReviewDialogProps {
    dialogOpen: boolean;
    dialogType: 'approve' | 'disapprove' | null;
    finalNote: string;
    invalidQuestionsLength: number;
    notesLength: number;
    handleDialogClose: () => void;
    handleDialogSubmit: () => void;
    setFinalNote: (note: string) => void;
    isSubmitting: boolean;
}

export function ReviewDialog(
    {
        dialogOpen,
        dialogType,
        finalNote,
        invalidQuestionsLength,
        notesLength,
        handleDialogClose,
        handleDialogSubmit,
        setFinalNote,
        isSubmitting
    }: ReviewDialogProps) {
    return (
        <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
            <DialogTitle>{dialogType === 'approve' ? 'Aprovar Submissão' : 'Rejeitar Submissão'}</DialogTitle>
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
                <Close fontSize="inherit"/>
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
                    {dialogType === 'disapprove' && (
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
                            onChange={(e) => setFinalNote(e.target.value)}
                        />
                    )}
                    {dialogType === 'approve' && invalidQuestionsLength !== notesLength && (
                        <Typography color="error">
                            Há questões inválidas que não tem notas associadas. Por favor, adicione notas a todas as
                            questões inválidas.
                        </Typography>
                    )}
                    {isSubmitting && <CircularProgress sx={{ display: 'block', margin: '0 auto' }} />}
                    <Box display="flex" justifyContent="space-between" width="70%">
                        <Button onClick={handleDialogClose}>Cancelar</Button>
                        <Button onClick={handleDialogSubmit}>Confirmar</Button>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
}