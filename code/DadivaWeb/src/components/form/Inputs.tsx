import React, { useEffect, useState } from 'react';
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
import { MedicationsServices } from '../../services/medications/MedicationsServices';
import { handleRequest } from '../../services/utils/fetch';
import { sanitizeInput } from './utils/sanitizeUtils';

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
        sx={{ borderRadius: 50, marginRight: 5 }}
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
      disabled={!enableEdit}
      sx={{ borderRadius: 50, height: 40 }}
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

type ReviewFormButtonProps = {
  onReview: () => void;
};

export function ReviewFormButton({ onReview }: ReviewFormButtonProps) {
  return (
    <Button variant="contained" onClick={onReview} startIcon={<PublishIcon />} sx={{ borderRadius: 50 }}>
      Rever o formulario
    </Button>
  );
}

interface TextInputProps {
  onChangeAnswer: (sanitizedValue: string) => void;
}

export function TextInput({ onChangeAnswer }: TextInputProps) {
  const [value, setValue] = useState<string>('');
  const handleChange = (value: React.ChangeEvent<HTMLInputElement>) => {
    setValue(value.target.value);
  };

  const handleSave = () => {
    const sanitizedValue = sanitizeInput(value);
    onChangeAnswer(sanitizedValue);
  };

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        p: 1,
      }}
    >
      <TextField
        variant="outlined"
        required
        rows={2}
        value={value}
        onChange={handleChange}
        label="Responda Aqui"
        inputProps={{ maxLength: 128 }}
        sx={{ mr: 2, width: '80%' }}
      />
      <Button
        variant="outlined"
        onClick={handleSave}
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

type MedicationsInput = {
  onChangeAnswer: (answer: string[]) => void;
};

export function MedicationsInput({ onChangeAnswer }: MedicationsInput) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [possibleOptions, setPossibleOptions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetch = async () => {
      const [error, res] = await handleRequest(MedicationsServices.searchMedications(inputValue));
      if (error) {
        console.log(error);
        //handleError(error, setError, nav);
        return;
      }
      setPossibleOptions(res);
      setLoading(false);
    };

    if (inputValue.length >= 3) {
      setLoading(true);
      fetch();
    } else {
      setPossibleOptions([]);
    }
  }, [inputValue]);

  return (
    <div>
      <Autocomplete
        loading={loading}
        loadingText={'A carregar opções...'}
        value={selectedOptions}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        onChange={(event, newValue) => {
          setSelectedOptions(newValue);
        }}
        renderInput={params => <TextField {...params} label="Medicamentos" />}
        multiple={true}
        options={possibleOptions}
      />
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
  );
}

type CountriesInput = {
  onChangeAnswer: (answer: string[]) => void;
};

interface CountryList {
  [key: string]: string[];
}

const mockContinents: CountryList = {
  Europa: ['Portugal', 'Espanha', 'França'],
  África: ['Angola', 'Moçambique', 'Cabo Verde'],
  'América do Sul': ['Brasil', 'Argentina', 'Venezuela'],
  'América do Norte': ['Estados Unidos', 'Canadá', 'México'],
  Ásia: ['China', 'Japão', 'Coreia do Sul'],
  Oceania: ['Austrália', 'Nova Zelândia', 'Fiji'],
};

export const mockCountries: string[] = Object.keys(mockContinents)
  .map(continent => {
    return mockContinents[continent];
  })
  .reduce((acc, val) => acc.concat(val), []);

export function CountriesInput({ onChangeAnswer }: CountriesInput) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [possibleOptions, setPossibleOptions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetch = async () => {
      const [error, res]: [Error | null, string[]] = [null, mockCountries];
      if (error) {
        console.log(error);
        //handleError(error, setError, nav);
        return;
      }
      setPossibleOptions(res);
      setLoading(false);
    };
    setLoading(true);
    fetch();
  }, []);

  return (
    <div>
      <Autocomplete
        loading={loading}
        loadingText={'A carregar opções...'}
        value={selectedOptions}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        onChange={(event, newValue) => {
          setSelectedOptions(newValue);
        }}
        renderInput={params => <TextField {...params} label="Paises" />}
        multiple={true}
        options={possibleOptions}
      />
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
  );
}

type DropdownProps = {
  options: string[];
  onChangeAnswer: (answer: string[]) => void;
};

export function DropdownInput({ options, onChangeAnswer }: DropdownProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const handleChange = (value: string[]) => {
    setSelectedOptions(value);
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
          renderInput={params => <TextField {...params} label="Opções" />}
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
        sx={{ borderRadius: 50, border: 1, borderColor: 'black' }}
      >
        Anterior
      </Button>
      <Button
        variant="contained"
        onClick={onNextQuestion}
        disabled={!nextEnabled}
        endIcon={<NavigateNextIcon />}
        sx={{ borderRadius: 50, border: 1, borderColor: 'black' }}
      >
        Seguinte
      </Button>
    </Box>
  );
}
