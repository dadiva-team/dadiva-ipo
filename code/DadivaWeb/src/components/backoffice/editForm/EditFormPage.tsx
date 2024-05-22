import React from 'react';
import { Box, Button } from '@mui/material';
import { Group } from './Group';
import LoadingSpinner from '../../shared/LoadingSpinner';
import { ErrorAlert } from '../../shared/ErrorAlert';
import { useEditFormPage } from './useEditFormPage';
import { QuestionEditDialog } from './dialogs/QuestionEditDialog';
import { Form, Question } from '../../../domain/Form/Form';
import { QuestionAddDialog } from './dialogs/QuestionAddDialog';
import { GroupAddDialog } from './dialogs/GroupAddDialog';
import { DeleteQuestionDialog } from './dialogs/DeleteQuestionDialog';
import { DeleteGroupDialog } from './dialogs/DeleteGroupDialog';
import { GroupEditDialog } from './dialogs/GroupEditDialog';

export function EditFormPage() {
  const {
    isLoading,
    editingQuestion,
    deletingQuestion,
    creatingQuestion,
    editingGroup,
    deletingGroup,
    creatingGroup,
    creatingQuestionInGroup,
    error,
    formFetchData,
    calculateRules,
    setFormFetchData,
    setEditingQuestion,
    setDeletingQuestion,
    setCreatingQuestion,
    setEditingGroup,
    setDeletingGroup,
    setCreatingGroup,
    setCreatingQuestionInGroup,
    setError,
    handleDrop,
    handleDeleteQuestion,
    moveGroup,
    deleteGroup,
    saveForm,
  } = useEditFormPage();

  return (
    <div>
      <div>
        {isLoading ? (
          <Box sx={{ mt: 1 }}>
            <LoadingSpinner text={'A carregar as perguntas...'} />
            <ErrorAlert error={error} clearError={() => setError(null)} />
          </Box>
        ) : (
          <div>
            <Button disabled={formFetchData.groups.length === 0} onClick={() => setCreatingQuestion(true)}>
              Criar Questão
            </Button>
            <Button onClick={() => setCreatingGroup(true)}>Criar Grupo</Button>
            {formFetchData.groups.map((group, index) => (
              <Group
                group={group}
                onDrop={handleDrop}
                onAddQuestion={() => {
                  setCreatingQuestion(true);
                  setCreatingQuestionInGroup(group);
                }}
                onEditRequest={question => setEditingQuestion(question)}
                onDeleteRequest={question => setDeletingQuestion(question)}
                onMoveUp={index === 0 ? null : () => moveGroup(index, index - 1)}
                onMoveDown={index === formFetchData.groups.length - 1 ? null : () => moveGroup(index, index + 1)}
                onRename={() => setEditingGroup(group)}
                onDelete={formFetchData.groups.length === 1 ? null : () => setDeletingGroup(group)}
                key={group.name}
              />
            ))}
            <QuestionEditDialog
              open={editingQuestion !== null}
              question={editingQuestion}
              questions={formFetchData.groups
                .find(group => group.questions.includes(editingQuestion))
                ?.questions.filter(q => q.id != editingQuestion.id)}
              onAnswer={(id, text, type, options, showCondition) => {
                setFormFetchData((oldForm: Form) => {
                  const newGroups = oldForm.groups.map(group => ({
                    name: group.name,
                    questions: group.questions.map(question =>
                      question.id === id ? ({ id, text, type, options, showCondition } as Question) : question
                    ),
                  }));
                  return {
                    groups: newGroups,
                    rules: calculateRules(newGroups),
                  };
                });
              }}
              onClose={() => setEditingQuestion(null)}
              isFirst={formFetchData.groups.some(group => group.questions.indexOf(editingQuestion) > 0)}
            />
            <QuestionAddDialog
              open={creatingQuestion}
              groups={
                creatingQuestionInGroup == null
                  ? formFetchData.groups.map(group => group.name)
                  : [creatingQuestionInGroup.name]
              }
              onAnswer={(question, groupName) => {
                setFormFetchData((oldForm: Form) => {
                  const newGroups = oldForm.groups.map(group => {
                    if (group.name === groupName) {
                      return { name: group.name, questions: [...(group.questions ?? []), question] };
                    }
                    return group;
                  });
                  return {
                    groups: newGroups,
                    rules: calculateRules(newGroups),
                  };
                });
              }}
              onClose={() => {
                setCreatingQuestion(false);
                setCreatingQuestionInGroup(null);
              }}
            />
            <DeleteQuestionDialog
              open={deletingQuestion !== null}
              questionText={deletingQuestion?.text}
              onAnswer={del => {
                if (!del) return;

                handleDeleteQuestion(deletingQuestion);
              }}
              onClose={() => setDeletingQuestion(null)}
            />
            <GroupEditDialog
              open={editingGroup !== null}
              group={editingGroup}
              onAnswer={(newName: string) => {
                setFormFetchData((oldForm: Form) => {
                  const newGroups = oldForm.groups.map(group => {
                    if (group.name === editingGroup.name) return { name: newName, questions: group.questions };
                    return group;
                  });
                  return {
                    groups: newGroups,
                    rules: calculateRules(newGroups),
                  };
                });
              }}
              onClose={() => setEditingGroup(null)}
            />
            <GroupAddDialog
              open={creatingGroup}
              onAnswer={groupName => {
                setFormFetchData((oldForm: Form) => {
                  const newGroups = [...oldForm.groups, { name: groupName, questions: [] }];
                  return {
                    groups: newGroups,
                    rules: calculateRules(newGroups),
                  };
                });
              }}
              onClose={() => setCreatingGroup(false)}
            />
            <DeleteGroupDialog
              open={deletingGroup !== null}
              groupName={deletingGroup?.name}
              onAnswer={del => {
                if (!del) return;
                deleteGroup(deletingGroup);
              }}
              onClose={() => setDeletingGroup(null)}
            />
            <Button disabled={!formFetchData.groups.some(g => g.questions.length !== 0)} onClick={saveForm}>
              Guardar Formulário
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
