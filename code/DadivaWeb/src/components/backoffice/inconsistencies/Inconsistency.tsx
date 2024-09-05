import React from 'react';
import { Box, Button, Divider, IconButton, TextField, Typography } from '@mui/material';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import DeleteIcon from '@mui/icons-material/Delete';
import { AllConditions, ConditionProperties, RuleProperties } from 'json-rules-engine';
import { Group } from '../../../domain/Form/Form';
import { translateResponse } from '../editForm/utils';
import { Edit } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

export interface InconsistencyProps {
  inconsistency: RuleProperties;
  groups: Group[];
  onAddCondition: () => void;
  onDelete: (index: number) => void;
  onDeleteGroup: () => void;
  onOpenEditDialog: (index: number, condition: ConditionProperties) => void;
  setReason: (reason: string) => void;
  reason: string;
}

function translateOperator(operator: string): string {
  return translations[operator] || operator;
}

export function Inconsistency({
  inconsistency,
  groups,
  onAddCondition,
  onDelete,
  onDeleteGroup,
  reason,
  setReason,
  onOpenEditDialog,
}: InconsistencyProps) {
  const { t } = useTranslation();

  return (
    <Box
      sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: 1, p: 2 }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
        <TextField
          autoFocus
          margin="dense"
          id="reason"
          label={t('Reason for Inconsistency')}
          type="text"
          fullWidth
          variant="outlined"
          value={reason}
          sx={{ width: '75%' }}
          onChange={e => setReason(e.target.value)}
        />
        <Button
          color="warning"
          variant="outlined"
          onClick={() => onDeleteGroup()}
          startIcon={<DeleteIcon />}
          sx={{ borderRadius: 50 }}
        >
          {t('Delete Group')}
        </Button>
      </Box>

      <Divider sx={{ mt: 1 }} />

      {(inconsistency.conditions as AllConditions).all.map((_condition, index) => {
        const condition = _condition as ConditionProperties;
        const questionText = groups
          .flatMap(group => group.questions)
          .find(question => question.id === condition.fact)?.text;

        return (
          <>
            <Box key={index} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 1, mt: 1 }}>
              <Box sx={{ width: '50%' }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {t('Question')}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {questionText ?? t('INVALID QUESTION ID')}
                </Typography>
              </Box>
              <Box sx={{ width: '10%' }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {t('Condition')}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {translateOperator(condition.operator)}
                </Typography>
              </Box>
              <Box sx={{ width: '25%', ml: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {t('Response')}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {translateResponse(condition.value)}
                </Typography>
              </Box>
              <Button
                color="warning"
                variant="outlined"
                onClick={() => onDelete(index)}
                startIcon={<DeleteIcon />}
                sx={{ borderRadius: 50, height: 40 }}
              />
              <IconButton edge="end" aria-label="down" onClick={() => onOpenEditDialog(index, condition)}>
                <Edit />
              </IconButton>
            </Box>
            <Divider />
          </>
        );
      })}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <IconButton color="primary" onClick={() => onAddCondition()}>
          <ControlPointIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

type OperatorTranslations = {
  [key: string]: string;
};

const translations: OperatorTranslations = {
  equal: 'igual a',
  notEqual: 'diferente de',
  greaterThan: 'maior que',
  greaterThanInclusive: 'maior ou igual a',
  lessThan: 'menor que',
  lessThanInclusive: 'menor ou igual a',
  in: 'em',
  notIn: 'não em',
};
