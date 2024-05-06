import React, { useState } from 'react';
import {
  Autocomplete,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import PublishIcon from '@mui/icons-material/Publish';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { Save } from '@mui/icons-material';

interface BooleanButtonsProps {
  onChangeAnswer: (answer: boolean) => void;
}

export function BooleanButtons({ onChangeAnswer }: BooleanButtonsProps) {
  const [isYesClicked, setIsYesClicked] = React.useState(false);
  const [isNoClicked, setIsNoClicked] = React.useState(false);

  const handleClick = (answer: boolean) => {
    onChangeAnswer(answer);
    if (answer) {
      setIsYesClicked(true);
      setIsNoClicked(false);
    } else {
      setIsNoClicked(true);
      setIsYesClicked(false);
    }
  };

  return (
    <div>
      <Button
        variant={isNoClicked ? 'contained' : 'outlined'}
        onClick={() => handleClick(false)}
        color={!isNoClicked && !isYesClicked ? 'error' : isNoClicked ? 'error' : 'inherit'}
        startIcon={<CloseIcon />}
        sx={{ borderRadius: 50 }}
      >
        Não
      </Button>
      <Button
        variant={isYesClicked ? 'contained' : 'outlined'}
        onClick={() => handleClick(true)}
        color={!isNoClicked && !isYesClicked ? 'success' : isYesClicked ? 'success' : 'inherit'}
        startIcon={<CheckIcon />}
        sx={{ borderRadius: 50 }}
      >
        Sim
      </Button>
    </div>
  );
}

type EditButtonnProps = {
  onChangeAnswer: () => void;
};

export function EditButton({ onChangeAnswer }: EditButtonnProps) {
  return (
    <Button variant="outlined" onClick={onChangeAnswer} startIcon={<EditIcon />} sx={{ borderRadius: 50 }}>
      Editar
    </Button>
  );
}

type NextQuestionButtonProps = {
  onNextQuestion: () => void;
};

export function NextQuestionButton({ onNextQuestion }: NextQuestionButtonProps) {
  return (
    <Button variant="contained" onClick={onNextQuestion} startIcon={<NavigateNextIcon />} sx={{ borderRadius: 50 }}>
      Próxima Pergunta
    </Button>
  );
}

type SubmitFormButtonProps = {
  onSubmit: () => void;
};

export function SubmitFormButton({ onSubmit }: SubmitFormButtonProps) {
  return (
    <Button variant="contained" onClick={onSubmit} startIcon={<PublishIcon />} sx={{ borderRadius: 50 }}>
      Submeter formulario
    </Button>
  );
}

interface TextInputProps {
  onChangeAnswer: (answer: string) => void;
}

export function TextInput({ onChangeAnswer }: TextInputProps) {
  return <input type="text" onChange={e => onChangeAnswer(e.target.value)} />;
}

export function WrongQuestionType() {
  return <div>Wrong Question Type detected. Please, do not proceed</div>;
}

type DropdownProps = {
  options: string[];
  onChangeAnswer: (answer: string) => void;
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export function MultipleSelectCheckmarks(options: string[]) {
  const [optionName, setOptionName] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof optionName>) => {
    const {
      target: { value },
    } = event;
    setOptionName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={optionName}
          onChange={handleChange}
          input={<OutlinedInput label="Paises" />}
          renderValue={selected => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {options.map(name => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={optionName.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export function CheckboxesTags({ options, onChangeAnswer }: DropdownProps) {
  const [selectedOptions, setSelectedOptions] = useState<string>('');
  const handleChange = (value: string[]) => {
    const joinedValue = value.join(', ');
    setSelectedOptions(joinedValue);
  };
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <div style={{ marginRight: '10px' }}>
        <Autocomplete
          multiple
          id="checkboxes-tags-demo"
          options={options}
          disableCloseOnSelect
          getOptionLabel={option => option}
          onChange={(event, value) => handleChange(value)}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
              {option}
            </li>
          )}
          style={{ width: 430 }}
          renderInput={params => <TextField {...params} label="Countrys" />}
        />
      </div>
      <div>
        <Button
          variant="outlined"
          onClick={() => onChangeAnswer(selectedOptions)}
          startIcon={<Save />}
          sx={{ borderRadius: 50 }}
          disabled={selectedOptions.length === 0}
        >
          Guardar
        </Button>
      </div>
    </div>
  );
}
