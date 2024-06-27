
export interface Submission{
    id: number;
    nic: number;
    answers: Answers[];
    submissionDate: string;
}

export interface Answers{
    questionId: string;
    answer: string;
}

export interface Note{
    id: string;
    note: string;
}