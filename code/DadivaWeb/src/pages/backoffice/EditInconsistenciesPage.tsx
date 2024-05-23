import React, { useEffect, useState } from 'react';
import { Box, Divider, IconButton, List, ListItem } from '@mui/material';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { ErrorAlert } from '../../components/shared/ErrorAlert';
import { Group } from '../../components/backoffice/inconsistencies/Group';
import { Form } from '../../domain/Form/Form';
import { useNavigate } from 'react-router-dom';
import { handleError, handleRequest } from '../../services/utils/fetch';
import { FormServices } from '../../services/from/FormServices';
import { RuleProperties } from 'json-rules-engine';
import { Inconsistency } from '../../components/backoffice/inconsistencies/Inconsistency';
import Typography from '@mui/material/Typography';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { AddConditionDialog } from '../../components/backoffice/inconsistencies/AddConditionDialog';

const SHOW_FORM = false;

export function EditInconsistenciesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formFetchData, setFormFetchData] = useState<Form>();
  const [inconsistencies, setInconsistencies] = useState<RuleProperties[]>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [addingCondition, setAddingCondition] = useState<number>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [addingInconsistency, setAddingInconsistency] = useState<boolean>(false);

  const nav = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const [formError, formRes] = await handleRequest(FormServices.getForm());
      if (formError) {
        handleError(formError, setError, nav);
        return;
      }
      setFormFetchData(formRes);
      const [incError, inconsistenciesRes] = await handleRequest(FormServices.getInconsistencies());

      if (incError) {
        handleError(incError, setError, nav);
        return;
      }

      setInconsistencies(inconsistenciesRes);
      setIsLoading(false);
    };

    if (isLoading) fetch();
  }, [isLoading, nav]);

  function onAddInconsistency() {
    setAddingInconsistency(true);
  }

  function onAddCondition(index: number) {
    setAddingCondition(index);
  }

  return (
    <div>
      <div>
        {isLoading ? (
          <Box sx={{ mt: 1 }}>
            <LoadingSpinner text={'A carregar as perguntas...'} />
            <ErrorAlert error={error} clearError={() => setError(null)} />
          </Box>
        ) : (
          <>
            <Box>
              {SHOW_FORM && <Typography variant="h6">Formulário</Typography> &&
                formFetchData.groups.map(group => <Group group={group} key={group.name} />)}
            </Box>
            <Box sx={{ width: '100%' }}>
              <Typography variant="h6">Inconsistências</Typography>
              <List sx={{ width: '100%' }}>
                {inconsistencies.map((inc, index) => (
                  <ListItem key={index}>
                    <Box
                      sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Inconsistency
                        inconsistency={inc}
                        groups={formFetchData.groups}
                        onAddCondition={() => onAddCondition(index)}
                      />
                      {index !== inconsistencies.length - 1 && <Divider />}
                    </Box>
                  </ListItem>
                ))}
              </List>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <IconButton color="primary" onClick={() => onAddInconsistency()}>
                  <ControlPointIcon />
                </IconButton>
              </Box>
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
          </>
        )}
      </div>
    </div>
  );
}
