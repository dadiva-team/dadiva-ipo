import React from 'react';
import {
  Button,
  FormControl,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import { ArrowDownward, ArrowUpward, Delete } from '@mui/icons-material';

interface DropdownOptionsFormProps {
  optionInput: string;
  questionOptions: string[];
  setOptionInput: (value: string) => void;
  handleAddOption: () => void;
  handleRemoveOption: (index: number) => void;
  moveOptionUp: (index: number) => void;
  moveOptionDown: (index: number) => void;
}

export function DropdownOptionsForm({
  optionInput,
  questionOptions,
  setOptionInput,
  handleAddOption,
  handleRemoveOption,
  moveOptionUp,
  moveOptionDown,
}: DropdownOptionsFormProps) {
  return (
    <FormControl fullWidth margin="normal">
      <TextField
        id="option-input"
        value={optionInput}
        label="Adicionar Opção"
        onChange={event => setOptionInput(event.target.value)}
        fullWidth
      />
      <Button
        onClick={handleAddOption}
        sx={{
          mt: 1,
          alignSelf: 'center',
        }}
      >
        Add Option
      </Button>
      <Typography variant="h6" sx={{ mt: 2 }}>
        Escolhas Possíveis
      </Typography>
      <List>
        {questionOptions?.map((option, index) => (
          <ListItem key={index}>
            <ListItemText primary={option} />
            <ListItemSecondaryAction>
              <IconButton disabled={index === 0} edge="end" aria-label="up" onClick={() => moveOptionUp(index)}>
                <ArrowUpward />
              </IconButton>
              <IconButton
                disabled={index === questionOptions.length - 1}
                edge="end"
                aria-label="down"
                onClick={() => moveOptionDown(index)}
              >
                <ArrowDownward />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveOption(index)}>
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </FormControl>
  );
}
