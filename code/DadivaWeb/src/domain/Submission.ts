
export interface Submission{
    nic: number;
    answers: Answers[];
    submissionDate: string;
}

export interface Answers{
    questionId: string;
    answer: string;
}