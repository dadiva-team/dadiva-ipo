import { AllConditions, ConditionProperties, RuleProperties } from 'json-rules-engine';
import React from 'react';
import { Box, IconButton } from '@mui/material';
import Typography from '@mui/material/Typography';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { Group } from '../../../domain/Form/Form';

export interface InconsistencyProps {
  inconsistency: RuleProperties;
  groups: Group[];
  onAddCondition: () => void;
}

export function Inconsistency({ inconsistency, groups, onAddCondition }: InconsistencyProps) {
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
      <Typography>Incoerência</Typography>
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
                width: '100%',
                border: 1,
              }}
            >
              {groups.flatMap(group => group.questions).find(question => question.id === condition.fact)?.text ??
                'INVALID QUESTION ID'}
            </Box>
            <Box
              sx={{
                width: '100%',
                border: 1,
              }}
            >
              {condition.operator}
            </Box>
            <Box
              sx={{
                width: '100%',
                border: 1,
              }}
            >
              {condition.value}
            </Box>
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
