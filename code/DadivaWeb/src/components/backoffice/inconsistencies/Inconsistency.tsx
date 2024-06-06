import { AllConditions, ConditionProperties, RuleProperties } from 'json-rules-engine';
import React from 'react';
import { Box, Button, IconButton } from '@mui/material';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { Group } from '../../../domain/Form/Form';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';

export interface InconsistencyProps {
  inconsistency: RuleProperties;
  groups: Group[];
  onAddCondition: () => void;
  onDelete: () => void;
}

export function Inconsistency({ inconsistency, groups, onAddCondition, onDelete }: InconsistencyProps) {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        border: 1,
      }}
    >
      {(inconsistency.conditions as AllConditions).all.map((_condition, index) => {
        const condition = _condition as ConditionProperties;
        return (
          <Box
            key={index}
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Box
              sx={{
                pl: 0.5,
                width: '50%',
                border: 1,
              }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                {groups.flatMap(group => group.questions).find(question => question.id === condition.fact)?.text ??
                  'INVALID QUESTION ID'}
              </Typography>
            </Box>
            <Box
              sx={{
                pl: 0.5,
                width: '15%',
                border: 1,
              }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                {condition.operator}
              </Typography>
            </Box>
            <Box
              sx={{
                pl: 0.5,
                width: '25%',
                border: 1,
              }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                {' '}
                {condition.value}{' '}
              </Typography>
            </Box>
            <Button
              color="warning"
              variant="outlined"
              onClick={() => onDelete()}
              startIcon={<DeleteIcon />}
              sx={{ borderRadius: 50, height: 40 }}
            >
              Apagar
            </Button>
          </Box>
        );
      })}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <IconButton color="primary" onClick={() => onAddCondition()}>
          <ControlPointIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
