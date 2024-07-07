import {Group, Question} from "../../../domain/Form/Form";

export interface FormWithVersionDomainModel {
    groups: Group[];
    formVersion: number;
}

export interface FormWithVersionOutputModel {
    groups: { name: string; questions: QuestionModel[] }[];
    formVersion: number;
}

export class QuestionModel {
    id: string;
    text: string;
    type: string;
    options: string[] | null;
}

export function FormWithVersionModelToDomain(formModel: FormWithVersionOutputModel): FormWithVersionDomainModel {
    const groups = formModel.groups.map(group => {
        return {
            name: group.name,
            questions: group.questions.map(questionModel => {
                return {
                    id: questionModel.id,
                    text: questionModel.text,
                    type: questionModel.type,
                    options: questionModel.options,
                } as Question;
            }),
        };
    })

    return {
        groups,
        formVersion: formModel.formVersion
    };
}