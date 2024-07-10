import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import {Box, Button, FormControl, IconButton, TextField} from "@mui/material";
import {Close} from "@mui/icons-material";
import DialogContent from "@mui/material/DialogContent";

export interface NoteDialogProps {
    open: boolean;
    note?: string;
    onAnswer: (note: string) => void;
    onClose: () => void;
}

export function NoteDialog({open, note, onAnswer, onClose}: NoteDialogProps) {
    const [noteText, setNoteText] = React.useState(note ?? '');

    const handleCloseAndAnswer = React.useCallback(() => {
        onAnswer(noteText);
        onClose();
    }, [noteText, onAnswer, onClose]);

    return (
        <Dialog
            onClose={onClose}
            open={open}
            aria-labelledby="edit-dialog-title"
            maxWidth="sm" fullWidth
        >
            <DialogTitle id="edit-dialog-title">Adicionar Nota</DialogTitle>
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
                <Close fontSize="inherit"/>
            </IconButton>
            <DialogContent dividers>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                        width: '100%',
                    }}
                >
                    <FormControl fullWidth>
                        <TextField
                            autoFocus={open}
                            value={noteText}
                            label="Nota"
                            multiline
                            rows={4}
                            onChange={event => {
                                setNoteText(event.target.value);
                            }}
                        />
                    </FormControl>
                    <Box display="flex" justifyContent="space-between" width="70%">
                        <Button onClick={onClose}>Cancelar</Button>
                        <Button onClick={handleCloseAndAnswer} disabled={noteText.length === 0}>Guardar Nota</Button>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
