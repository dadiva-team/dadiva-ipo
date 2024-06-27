import {useState} from 'react';
import {QuestionWithAnswer} from './utils/DoctorSearchAux';
import {Note} from "../../../domain/Submission";

interface UseFormDetailsProps {
    notes: Note[];
    handleSaveNote: (questionId: string, noteContent: string) => void;
}

export function useFormDetails({notes, handleSaveNote}: UseFormDetailsProps) {
    const [open, setOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState<QuestionWithAnswer | null>(null);

    const handleClickOpen = (question: QuestionWithAnswer) => {
        setSelectedQuestion(question);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedQuestion(null);
    };

    const saveNote = (noteContent: string) => {
        if (selectedQuestion) {
            handleSaveNote(selectedQuestion.id, noteContent);
            handleClose();
        }
    };

    const getNoteContent = (id: string): string => {
        const note = notes?.find(note => note.id === id);
        return note ? note.note : null;
    };

    return {
        open,
        selectedQuestion,
        handleClickOpen,
        handleClose,
        saveNote,
        getNoteContent
    };
}
