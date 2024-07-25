import {Group} from '../../domain/Form/Form';
import {Inconsistency} from './search/utils/DoctorSearchAux';
import {Submission} from '../../domain/Submission/Submission';
import React, {useEffect, useState} from 'react';
import {Box, Button, DialogActions, DialogContentText, Divider, IconButton, Modal, Typography} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {Close} from '@mui/icons-material';
import {PendingSubmissionResults} from './search/pendingSubmission/PendingSubmissionResults';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import {handleRequest} from '../../services/utils/fetch';
import {DoctorServices} from '../../services/doctors/DoctorServices';

export interface PendingSubmissionCardProps {
    formGroups: Group[];
    inconsistencies: Inconsistency[];
    submission: Submission;
    onSubmitedSuccessfully: () => void;
    locked: boolean;
    doctorNic: number;
    isReviewing: boolean;
    onOpenReview: () => void;
    onCloseReview: () => void;
    forceCloseModal: boolean;
}

export function PendingSubmissionCard(
    {
        formGroups,
        inconsistencies,
        submission,
        onSubmitedSuccessfully,
        locked,
        doctorNic,
        isReviewing,
        onOpenReview,
        onCloseReview,
        forceCloseModal
    }: PendingSubmissionCardProps) {
    const [openModal, setOpenModal] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
        };

        if (openModal) {
            window.addEventListener('beforeunload', handleBeforeUnload);
        }

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [openModal]);

    const handleOpenModal = async () => {
        if (locked) return;
        const [error] = await handleRequest(DoctorServices.lockSubmission(submission.id, doctorNic));
        if (error) {
            return;
        }
        setOpenModal(true);
        onOpenReview();
    };

    const handleCloseModal = async () => {
        setConfirmDialogOpen(true);
    };

    const handleConfirmClose = async () => {
        setConfirmDialogOpen(false);
        setOpenModal(false);
        await handleRequest(DoctorServices.unlockSubmission(submission.id, doctorNic));
        onCloseReview();
    };

    const handleCancelClose = () => {
        setConfirmDialogOpen(false);
    };

    useEffect(() => {
        if(openModal && forceCloseModal){
            setOpenModal(false)
            onCloseReview()
        }
    }, [openModal, forceCloseModal, onCloseReview]);


    return (
        <Box sx={{pl: 2}}>
            <Typography>
                <strong>Formulario submetido: </strong> {submission.submissionDate}
            </Typography>
            <Button endIcon={<OpenInNewIcon/>} onClick={handleOpenModal} disabled={locked || isReviewing}>
                {locked ? 'Submissão a ser revista' : 'Rever'}
            </Button>
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
                    <Box sx={{display: 'flex', justifyContent: 'space-between', flexDirection: 'row', pb: 1}}>
                        <Typography variant="h6">Formulário Pendente</Typography>
                        <IconButton aria-label="close" color="inherit" size="small" onClick={handleCloseModal}>
                            <Close fontSize="inherit"/>
                        </IconButton>
                    </Box>
                    <Divider sx={{p: 0.5}}/>
                    <PendingSubmissionResults
                        formGroups={formGroups}
                        inconsistencies={inconsistencies}
                        submission={submission}
                        onSubmitedSuccessfully={() => {
                            onSubmitedSuccessfully();
                            handleCloseModal();
                        }}
                    />
                </Box>
            </Modal>
            <Dialog
                open={confirmDialogOpen}
                onClose={handleCancelClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{'Confirmar saída'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Tem certeza de que deseja sair? Todas as alterações não guardadas serão perdidas.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelClose} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirmClose} color="primary" autoFocus>
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
