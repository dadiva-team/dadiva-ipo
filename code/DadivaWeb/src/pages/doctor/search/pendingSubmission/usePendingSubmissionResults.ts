import { useState, useEffect } from 'react';
import { Group } from '../../../../domain/Form/Form';
import { Note, Submission } from '../../../../domain/Submission/Submission';
import { useNavigate } from 'react-router-dom';
import {
    buildFormWithAnswers,
    checkFormValidity,
    Inconsistency,
    QuestionWithAnswer,
} from '../utils/DoctorSearchAux';
import { handleRequest, handleError } from '../../../../services/utils/fetch';
import {useCurrentSession} from "../../../../session/Session";
import {ReviewFormRequestModel} from "../../../../services/doctors/models/ReviewFormRequestModel";
import {DoctorServices} from "../../../../services/doctors/DoctorServices";

interface UsePendingSubmissionCheckProps {
    formGroups: Group[];
    inconsistencies: Inconsistency[];
    submission: Submission;
    onSubmitedSuccessfully: () => void;
}

export function usePendingSubmissionResults({ formGroups, submission, inconsistencies, onSubmitedSuccessfully }: UsePendingSubmissionCheckProps) {
    const nav = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const [formWithAnswers, setFormWithAnswers] = useState<QuestionWithAnswer[]>(null);
    const [invalidQuestions, setInvalidQuestions] = useState<string[]>(null);
    const [notes, setNotes] = useState<Note[]>([]);
    const [showDetails, setShowDetails] = useState<boolean>(false);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState<'approved' | 'rejected' | null>(null);
    const [finalNote, setFinalNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const doctor = useCurrentSession();

    useEffect(() => {
        if (formWithAnswers == null) {
            setFormWithAnswers(buildFormWithAnswers({ formGroups, donorAnswers: submission.answers }));
        }
    }, [formWithAnswers, formGroups, submission]);

    useEffect(() => {
        if (formWithAnswers != null && inconsistencies != null) {
            setInvalidQuestions(checkFormValidity(formWithAnswers, inconsistencies));
        }
    }, [formWithAnswers, inconsistencies]);

    const handleSaveNote = (questionId: string, noteContent: string) => {
        setNotes(prevNotes => {
            const noteIndex = prevNotes?.findIndex(note => note.id === questionId);
            if (noteIndex > -1) {
                prevNotes[noteIndex].note = noteContent;
            } else {
                prevNotes.push({ id: questionId, note: noteContent });
            }
            return [...prevNotes];
        });
    };

    const handleDialogOpen = (type: 'approved' | 'rejected') => {
        setDialogType(type);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setDialogType(null);
        setFinalNote('');
    };

    const handleDialogSubmit = async () => {
        setIsSubmitting(true);
        await submitReview(dialogType, finalNote);
        handleDialogClose();
        setIsSubmitting(false);
    };

    const submitReview = async (status: string, finalNote?: string) => {
        const reviewData = {
            doctorNic: doctor.nic,
            status,
            finalNote,
            notes: notes.map(note => ({
                questionId: note.id,
                noteText: note.note
            }))
        } as ReviewFormRequestModel;

        const [error, res] = await handleRequest(DoctorServices.reviewSubmission(submission.id, reviewData));
        if (error) {
            handleError(error, setError, nav);
            return;
        }
        console.log(res);
        if (res) {
            console.log('Review submitted successfully');
            onSubmitedSuccessfully();
        }
    }

    return {
        error,
        inconsistencies,
        formWithAnswers,
        invalidQuestions,
        notes,
        showDetails,
        dialogOpen,
        dialogType,
        finalNote,
        isSubmitting,
        setError,
        setShowDetails,
        handleSaveNote,
        handleDialogOpen,
        handleDialogClose,
        handleDialogSubmit,
        setFinalNote,
        submitReview
    };
}
