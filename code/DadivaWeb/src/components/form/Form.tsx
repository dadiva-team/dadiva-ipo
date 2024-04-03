import * as React from "react";
import {useState} from "react";

class SubQuestion{
    rule:string
    question:string
    responseType:string
}

//TODO:proof of concept
export default function Form() {
    const [currentSubQuestions, setCurrentSubQuestions] = useState<
        Record<string, string | null>
    >({});

    const form = {
        "Questions":[
            {
                "question":"Tomou ou está a tomar medicamentos?",
                "subQuestions":[
                    {
                        "rule":"yes",
                        "question": "Por favor indique qual a medicação:",
                        "responseType": "dropdown"
                    }
                ]
            },
            {
                "question":"Alguma vez viajou para forma do pais?",
                "subQuestions":[
                    {
                        "rule":"yes",
                        "question":"Para que continente?",
                        "responseType": "dropdown"
                    }
                ]
            },
            {
                "question":"Tem sido sempre saudavel?"
            }
        ]
    }
    function onQuestionAnswer(value: string, mainQuestion: string, subQuestions: SubQuestion[] | undefined) {
        console.log("Question Answered");
        if (subQuestions === undefined) return;

        if (subQuestions[0].rule === value) {
            setCurrentSubQuestions({
                ...currentSubQuestions,
                [mainQuestion]: subQuestions[0].question
            });
        } else {
            setCurrentSubQuestions({
                ...currentSubQuestions,
                [mainQuestion]: null
            });
        }
    }

    async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
        ev.preventDefault();
        console.log("Respostas submetidas")
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                    {
                        form.Questions.map( mainQuestion => (
                            <div key={mainQuestion.question}>
                                <h1> {mainQuestion.question} </h1>
                                <input
                                    type="radio"
                                    id="Sim"
                                    name={mainQuestion.question}
                                    onChange={()=>onQuestionAnswer("yes", mainQuestion.question, mainQuestion.subQuestions)}
                                />
                                <label htmlFor="Sim">Sim</label>
                                <input
                                    type="radio"
                                    id="Nao"
                                    name={mainQuestion.question}
                                    onChange={()=>onQuestionAnswer("no", mainQuestion.question, mainQuestion.subQuestions)}
                                />
                                <label htmlFor="Nao">Não</label>
                                {currentSubQuestions[mainQuestion.question] && (
                                    <div>{currentSubQuestions[mainQuestion.question]}</div>
                                )}
                            </div>
                        ))
                    }
                <button type="submit">Submeter</button>
            </form>
        </div>
    );
}