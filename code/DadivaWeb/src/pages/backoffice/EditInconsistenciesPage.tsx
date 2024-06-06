import React from 'react';
import { Box, Button, Card, Divider, List } from '@mui/material';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { ErrorAlert } from '../../components/shared/ErrorAlert';
import { Group } from '../../components/backoffice/inconsistencies/Group';
import { Inconsistency } from '../../components/backoffice/inconsistencies/Inconsistency';
import Typography from '@mui/material/Typography';
import { AddConditionDialog } from '../../components/backoffice/inconsistencies/AddConditionDialog';
import { useEditInconsistenciesPage } from '../../components/backoffice/inconsistencies/useEditInconsistenciesPage';

const SHOW_FORM = false;

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
    onDeletingInconsistency,
    conditionAllIsEmpty,
    saveInconsistencies,
  } = useEditInconsistenciesPage();

  return (
    <div>
      <div>
        {isLoading ? (
          <Box sx={{ mt: 1 }}>
            <LoadingSpinner text={'A carregar as incoerências...'} />
            <ErrorAlert error={error} clearError={() => setError(null)} />
          </Box>
        ) : (
          <>
            <List sx={{ width: '100%' }}>
              {inconsistencies.map((inc, index) => (
                <Card
                  key={index}
                  sx={{
                    margin: 2,
                    border: 1.5,
                    borderColor: 'black',
                  }}
                >
                  <Inconsistency
                    inconsistency={inc}
                    groups={formFetchData.groups}
                    onAddCondition={() => onAddCondition(index)}
                    onDelete={() => onDeletingInconsistency(index, inc)}
                  />
                  {index !== inconsistencies.length - 1 && <Divider />}
                </Card>
              ))}
            </List>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Button
                color="primary"
                disabled={conditionAllIsEmpty(inconsistencies[inconsistencies.length - 1]?.conditions)}
                onClick={() => onAddInconsistency()}
              >
                Criar Grupo
              </Button>
            </Box>
            <Box>
              {SHOW_FORM && <Typography variant="h6">Formulário</Typography> &&
                formFetchData.groups.map(group => <Group group={group} key={group.name} />)}
            </Box>
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
            <Button disabled={inconsistencies.length == 0} onClick={saveInconsistencies}>
              Guardar Incoerências
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
