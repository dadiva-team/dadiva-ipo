import React from 'react';
import { Box, Button } from '@mui/material';
import { Group } from '../../components/backoffice/editForm/Group';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { ErrorAlert } from '../../components/shared/ErrorAlert';
import { useEditFormPage } from '../../components/backoffice/editForm/useEditFormPage';
import { QuestionEditDialog } from '../../components/backoffice/editForm/dialogs/QuestionEditDialog';
import { Form } from '../../domain/Form/Form';
import { QuestionAddDialog } from '../../components/backoffice/editForm/dialogs/QuestionAddDialog';
import { GroupAddDialog } from '../../components/backoffice/editForm/dialogs/GroupAddDialog';
import { DeleteQuestionDialog } from '../../components/backoffice/editForm/dialogs/DeleteQuestionDialog';
import { DeleteGroupDialog } from '../../components/backoffice/editForm/dialogs/DeleteGroupDialog';
import { GroupEditDialog } from '../../components/backoffice/editForm/dialogs/GroupEditDialog';
import { SubQuestionEditDialog } from '../../components/backoffice/editForm/dialogs/SubQuestionEditDialog';
import { SubmitDialog } from '../../components/backoffice/editForm/dialogs/SubmitDialog';
import { SubmitFormButton } from '../../components/form/Inputs';
import { EditFormPlaygroundModal } from './EditFormPlaygroundModal';
import { useTranslation } from 'react-i18next';

export function EditFormPage() {
  const {
    isLoading,
    isSubmitting,
    editingQuestion,
    editingSubQuestion,
    deletingQuestion,
    creatingQuestion,
    editingGroup,
    deletingGroup,
    creatingGroup,
    creatingQuestionInGroup,
    error,
    dropError,
    submitError,
    form,
    calculateRules,
    setFormFetchData,
    setEditingQuestion,
    setEditingSubQuestion,
    setDeletingQuestion,
    setCreatingQuestion,
    setEditingGroup,
    setDeletingGroup,
    setCreatingGroup,
    setCreatingQuestionInGroup,
    setError,
    setDropError,
    handleDrop,
    handleDeleteQuestion,
    handleRemoveCondition,
    handleUpdateQuestion,
    handleAddQuestion,
    moveGroup,
    deleteGroup,
    formPlaygroundModalOpen,
    submitDialogOpen,
    closeModalPlayground,
    openModalPlayground,
    handleOpenSubmitDialog,
    handleCloseSubmitDialog,
    formChanges,
    handleSaveForm,
  } = useEditFormPage();
  const { t } = useTranslation();

  return (
    <Box>
      {isLoading ? (
        <Box sx={{ mt: 1 }}>
          <LoadingSpinner text={t('Loading Questions')} />
          <ErrorAlert error={error} clearError={() => setError(null)} />
        </Box>
      ) : (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pl: 1, pr: 2 }}>
            <Box>
              <Button
                variant="outlined"
                sx={{ borderRadius: 40, marginRight: 2 }}
                disabled={form.groups.length === 0}
                onClick={() => setCreatingQuestion(true)}
              >
                {t('Create Question')}
              </Button>
              <Button variant="outlined" sx={{ borderRadius: 40 }} onClick={() => setCreatingGroup(true)}>
                {t('Create Group')}
              </Button>
            </Box>
            <Button variant="contained" onClick={() => openModalPlayground()}>
              {t('Test Form')}
            </Button>
          </Box>
          {form.groups.map((group, index) => (
            <Group
              group={group}
              onDrop={handleDrop}
              onAddQuestion={() => {
                setCreatingQuestionInGroup(group.name);
                setCreatingQuestion(true);
              }}
              onEditRequest={question => setEditingQuestion(question)}
              onSubEditRequest={question => setEditingSubQuestion(question)}
              onDeleteRequest={(question, isSubQuestion, parentQuestionId) =>
                setDeletingQuestion({
                  question,
                  isSubQuestion,
                  parentQuestionId,
                })
              }
              onMoveUp={index === 0 ? null : () => moveGroup(index, index - 1)}
              onMoveDown={index === form.groups.length - 1 ? null : () => moveGroup(index, index + 1)}
              onDropError={dropError}
              onDropErrorClear={() => setDropError(null)}
              onRename={() => setEditingGroup(group)}
              onDelete={form.groups.length === 1 ? null : () => setDeletingGroup(group)}
              key={group.name}
            />
          ))}
          <EditFormPlaygroundModal
            form={form}
            openModal={formPlaygroundModalOpen}
            handleCloseModal={closeModalPlayground}
          />
          <QuestionEditDialog
            open={editingQuestion !== null}
            question={editingQuestion}
            questions={form.groups
              .find(group => group.questions.includes(editingQuestion))
              ?.questions.filter(q => q.id !== editingQuestion.id)}
            onAnswer={(id, text, type, options, showCondition, parentQuestionId) =>
              handleUpdateQuestion(id, text, type, options, showCondition, parentQuestionId)
            }
            subQuestions={Array.from(
              new Set(
                form.groups
                  .find(group => group.questions.includes(editingQuestion))
                  ?.questions.filter(q => q.showCondition?.if?.[editingQuestion?.id])
              )
            )}
            onRemoveCondition={(questionId, conditionId) => handleRemoveCondition(questionId, conditionId)}
            onOpenSubQuestionDialog={question => {
              setEditingQuestion(null);
              setEditingSubQuestion(question);
            }}
            onClose={() => setEditingQuestion(null)}
            isFirst={form.groups.some(group => group.questions.indexOf(editingQuestion) > 0)}
          />
          <SubQuestionEditDialog
            open={editingSubQuestion !== null}
            question={editingSubQuestion}
            questions={form.groups
              .find(group => group.questions.includes(editingSubQuestion))
              ?.questions.filter(q => q.id !== editingSubQuestion?.id)}
            //formFetchData.groups.flatMap(group => group.questions)}
            onDeleteSubQuestion={handleDeleteQuestion}
            onRemoveCondition={(questionId, conditionId) => handleRemoveCondition(questionId, conditionId)}
            onAnswer={handleUpdateQuestion}
            onClose={() => setEditingSubQuestion(null)}
          />

          <QuestionAddDialog
            open={creatingQuestion}
            groups={
              creatingQuestionInGroup || creatingQuestionInGroup !== undefined
                ? [creatingQuestionInGroup]
                : form.groups.map(group => group.name)
            }
            onAnswer={(question, groupName) => {
              handleAddQuestion(question, groupName);
              setCreatingQuestionInGroup(null);
            }}
            onClose={() => {
              setCreatingQuestion(false);
              setCreatingQuestionInGroup(null);
            }}
          />
          <DeleteQuestionDialog
            open={deletingQuestion !== null}
            questionText={deletingQuestion?.question?.text}
            onAnswer={del => {
              if (!del) return;
              const subQuestions = Array.from(
                new Set(
                  form.groups
                    .find(group => group.questions.includes(deletingQuestion.question))
                    ?.questions.filter(q => q.showCondition?.if?.[deletingQuestion?.question?.id])
                )
              );
              console.log(subQuestions);
              if (subQuestions.length > 0) {
                subQuestions.forEach(subQuestion => {
                  handleRemoveCondition(deletingQuestion.question.id, subQuestion.id);
                });
              }
              handleDeleteQuestion(
                deletingQuestion.question,
                deletingQuestion.isSubQuestion,
                deletingQuestion.parentQuestionId
              );
            }}
            onClose={() => setDeletingQuestion(null)}
          />
          <GroupEditDialog
            open={editingGroup !== null}
            group={editingGroup}
            onAnswer={(newName: string) => {
              setFormFetchData((oldForm: Form) => {
                const newGroups = oldForm.groups.map(group => {
                  if (group.name === editingGroup.name)
                    return {
                      name: newName,
                      questions: group.questions,
                    };
                  return group;
                });
                return {
                  groups: newGroups,
                  rules: calculateRules(newGroups),
                  language: oldForm.language,
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
                console.log('new groups', newGroups);
                return {
                  groups: newGroups,
                  rules: calculateRules(newGroups),
                  language: oldForm.language,
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
          <SubmitDialog
            open={submitDialogOpen}
            onClose={handleCloseSubmitDialog}
            onSubmit={handleSaveForm}
            onError={submitError}
            isLoading={isSubmitting}
            changes={formChanges}
          />
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <SubmitFormButton
              onSubmit={handleOpenSubmitDialog}
              disabled={form.groups.length == 0 || form.groups.some(value => value.questions.length == 0)}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}
