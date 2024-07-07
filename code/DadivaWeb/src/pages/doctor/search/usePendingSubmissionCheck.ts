import { useState, useEffect } from 'react';
import { Group } from '../../../domain/Form/Form';
import { Note, Submission } from '../../../domain/Submission';
import { useNavigate } from 'react-router-dom';
import {
    buildFormWithAnswers,
    checkFormValidity,
    extractInconsistencies,
    Inconsistency,
    QuestionWithAnswer,
} from './utils/DoctorSearchAux';
import { handleRequest, handleError } from '../../../services/utils/fetch';
import { FormServices } from '../../../services/from/FormServices';
import {useCurrentSession} from "../../../session/Session";
import {ReviewFormOutputModel} from "../../../services/doctors/models/ReviewFormOutputModel";
import {DoctorServices} from "../../../services/doctors/DoctorServices";

interface UsePendingSubmissionCheckProps {
    formGroups: Group[];
    submission: Submission;
}

export function usePendingSubmissionCheck({ formGroups, submission }: UsePendingSubmissionCheckProps) {
    const nav = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [inconsistencies, setInconsistencies] = useState<Inconsistency[]>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [formWithAnswers, setFormWithAnswers] = useState<QuestionWithAnswer[]>(null);
    const [invalidQuestions, setInvalidQuestions] = useState<QuestionWithAnswer[]>(null);
    const [notes, setNotes] = useState<Note[]>([]);
    const [showDetails, setShowDetails] = useState<boolean>(false);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState<'approve' | 'disapprove' | null>(null);
    const [finalNote, setFinalNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const doctor = useCurrentSession();

    useEffect(() => {
        const fetch = async () => {
            const [error, res] = await handleRequest(FormServices.getInconsistencies());
            if (error) {
                handleError(error, setError, nav);
                setIsLoading(false); // stop loading if there is an error
                return;
            }
            const inconsistencies = res.length > 0 ? extractInconsistencies(res[0]) : [];
            setInconsistencies(inconsistencies.length == 0 ? null : inconsistencies);
        };

        if (inconsistencies == null) {
            fetch().then(() => setIsLoading(false));
        }
    }, [inconsistencies, nav]);

    useEffect(() => {
        if (formWithAnswers == null) {
            setFormWithAnswers(buildFormWithAnswers({ formGroups, donorAnswers: submission.answers }));
        }
    }, [formWithAnswers, formGroups, submission]);

    useEffect(() => {
        if (formWithAnswers != null && inconsistencies != null) {
            setInvalidQuestions(checkFormValidity(formWithAnswers, inconsistencies).invalidQuestions);
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

    const handleDialogOpen = (type: 'approve' | 'disapprove') => {
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
        } as ReviewFormOutputModel;

        const [error, res] = await handleRequest(DoctorServices.reviewSubmission(submission.id, reviewData));
        if (error) {
            handleError(error, setError, nav);
            return;
        }
        console.log(res);
        if (res) {
            console.log('Review submitted successfully');
            nav('/doctor');
        }
    }

    return {
        error,
        inconsistencies,
        isLoading,
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
