import React from 'react';
import { Box, Button, Card, Divider, List } from '@mui/material';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { ErrorAlert } from '../../components/shared/ErrorAlert';
import { Group } from '../../components/backoffice/inconsistencies/Group';
import { Inconsistency } from '../../components/backoffice/inconsistencies/Inconsistency';
import Typography from '@mui/material/Typography';
import { AddConditionDialog } from '../../components/backoffice/inconsistencies/AddConditionDialog';
import { useEditInconsistenciesPage } from '../../components/backoffice/inconsistencies/useEditInconsistenciesPage';
import { FormShowModal } from '../../components/backoffice/inconsistencies/FormShowDialog';
import { SubmitInconsistenciesButton } from '../../components/form/Inputs';
import { EditConditionDialog } from '../../components/backoffice/inconsistencies/EditConditionDialog';

export function EditInconsistenciesPage() {
  const {
    isLoading,
    error,
    formFetchData,
    inconsistencies,
    setInconsistencies,
    addingCondition,
    setAddingCondition,
    setError,
    onAddInconsistency,
    onAddCondition,
    onEditCondition,
    onDeletingInconsistencyGroup,
    onDeletingInconsistency,
    conditionAllIsEmpty,
    saveInconsistencies,
    showForm,
    onShowForm,
    onAddReason,
    reasons,
    onOpenEditDialog,
    editingCondition,
    setEditingCondition,
  } = useEditInconsistenciesPage();

  return (
    <Box>
      {isLoading ? (
        <Box sx={{ mt: 1 }}>
          <LoadingSpinner text={'A carregar as incoerências...'} />
          <ErrorAlert error={error} clearError={() => setError(null)} />
        </Box>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pl: 1, pr: 2 }}>
            <Typography variant="h6">Incoerências</Typography>
            <Box>
              <Button
                color="primary"
                disabled={conditionAllIsEmpty(inconsistencies[inconsistencies.length - 1]?.conditions)}
                onClick={() => onAddInconsistency()}
              >
                Criar Grupo
              </Button>
            </Box>
            <Button variant="contained" onClick={() => onShowForm()}>
              Ver fomulário
            </Button>
          </Box>
          <List sx={{ width: '100%' }}>
            {inconsistencies.map((inc, groupIndex) => (
              <Card
                key={groupIndex}
                sx={{
                  margin: 2,
                  border: 1.5,
                  borderColor: 'black',
                }}
              >
                <Inconsistency
                  inconsistency={inc}
                  groups={formFetchData.groups}
                  onAddCondition={() => onAddCondition(groupIndex)}
                  onDelete={ind => onDeletingInconsistency(groupIndex, ind)}
                  onDeleteGroup={() => onDeletingInconsistencyGroup(groupIndex)}
                  onOpenEditDialog={(incIdx, updatedCondition) =>
                    onOpenEditDialog(groupIndex, incIdx, updatedCondition)
                  }
                  reason={reasons[groupIndex]}
                  setReason={reason => onAddReason(groupIndex, reason)}
                />
                {groupIndex !== inconsistencies.length - 1 && <Divider />}
              </Card>
            ))}
          </List>
          <Box>
            {showForm && <Typography variant="h6">Formulário</Typography> &&
              formFetchData.groups.map(group => <Group group={group} key={group.name} />)}
          </Box>
          <FormShowModal form={formFetchData} openModal={showForm} handleCloseModal={onShowForm} />
          <AddConditionDialog
            open={addingCondition !== null}
            questions={formFetchData.groups.flatMap(g => g.questions)}
            onAnswer={(fact, type, answer) => {
              setInconsistencies(prev => {
                return prev.map((rule, i) => {
                  if (i == addingCondition && 'all' in rule.conditions)
                    return {
                      ...rule,
                      conditions: {
                        all: [...rule.conditions.all, { fact, operator: type, value: answer }],
                      },
                    };

                  return rule;
                });
              });
            }}
            onClose={() => setAddingCondition(null)}
          />
          <EditConditionDialog
            open={editingCondition !== null}
            questions={formFetchData.groups.flatMap(g => g.questions)}
            condition={editingCondition?.condition}
            onAnswer={(fact, answer) => {
              onEditCondition(editingCondition.groupIdx, editingCondition.incIdx, fact, answer);
              setEditingCondition(null);
            }}
            onClose={() => setEditingCondition(null)}
          />
          {error && <ErrorAlert error={error} clearError={() => setError(null)} />}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <SubmitInconsistenciesButton onSubmit={saveInconsistencies} disabled={inconsistencies.length == 0} />
          </Box>
        </>
      )}
    </Box>
  );
}
