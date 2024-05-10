import React, { useState } from 'react';
import { Autocomplete, Box, Button, Checkbox, Chip, TextField } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
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
    <Box
      sx={{
        width: '100%',
        display: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
      }}
    >
      <Button
        variant={isNoClicked ? 'contained' : 'outlined'}
        onClick={() => handleClick(false)}
        color={!isNoClicked && !isYesClicked ? 'error' : isNoClicked ? 'error' : 'inherit'}
        startIcon={<CloseIcon />}
        sx={{ borderRadius: 50, marginRight: 2 }}
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
    </Box>
  );
}

type EditButtonnProps = {
  onChangeAnswer: () => void;
  enableEdit: boolean;
};

export function EditButton({ onChangeAnswer, enableEdit }: EditButtonnProps) {
  return (
    <Button
      variant="outlined"
      onClick={onChangeAnswer}
      startIcon={<EditIcon />}
      disabled={enableEdit}
      sx={{ borderRadius: 50, height: '50%' }}
    >
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
  const [value, setValue] = useState<string>('');
  const handleChange = (value: React.ChangeEvent<HTMLInputElement>) => {
    setValue(value.target.value);
  };
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <TextField
        variant="outlined"
        required
        onChange={handleChange}
        label="Responda Aqui"
        sx={{ width: '100%', mb: 1 }}
      />
      <Button
        variant="outlined"
        onClick={() => onChangeAnswer(value)}
        startIcon={<Save />}
        disabled={value.length === 0}
        sx={{ borderRadius: 50 }}
      >
        Guardar
      </Button>
    </Box>
  );
}

export function WrongQuestionType() {
  return <div>Wrong Question Type detected. Please, do not proceed</div>;
}

type DropdownProps = {
  options: string[];
  onChangeAnswer: (answer: string) => void;
};

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
            <li {...props} key={option}>
              <Checkbox
                icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                checkedIcon={<CheckBoxIcon fontSize="small" />}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option}
            </li>
          )}
          renderTags={(tagValue, getTagProps) => {
            return tagValue.map((option, index) => <Chip {...getTagProps({ index })} key={option} label={option} />);
          }}
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

type NavButtonsProps = {
  prevEnabled: boolean;
  onPrevQuestion: () => void;
  nextEnabled: boolean;
  onNextQuestion: () => void;
};

export function NavButtons({ onNextQuestion, prevEnabled, nextEnabled, onPrevQuestion }: NavButtonsProps) {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        p: 1,
        pb: 2,
      }}
    >
      <Button
        variant="contained"
        onClick={onPrevQuestion}
        startIcon={<NavigateBeforeIcon />}
        disabled={!prevEnabled}
        sx={{ borderRadius: 50 }}
      >
        Anterior
      </Button>
      <Button
        variant="contained"
        onClick={onNextQuestion}
        disabled={!nextEnabled}
        endIcon={<NavigateNextIcon />}
        sx={{ borderRadius: 50 }}
      >
        Seguinte
      </Button>
    </Box>
  );
}
