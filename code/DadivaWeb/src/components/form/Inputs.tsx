import React from 'react';
import { Button } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';

export function BooleanRadio(questionName: string, onChangeAnswer: (answer: boolean) => void) {
  return (
    <div>
      <input type="radio" id="yes" name={questionName} value="yes" onChange={() => onChangeAnswer(true)} />
      <label htmlFor="huey">Sim</label>
      <input type="radio" id="no" name={questionName} value="no" onChange={() => onChangeAnswer(false)} />
      <label htmlFor="huey">Não</label>
    </div>
  );
}

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

interface TextInputProps {
  onChangeAnswer: (answer: string) => void;
}
export function TextInput({ onChangeAnswer }: TextInputProps) {
  return <input type="text" onChange={e => onChangeAnswer(e.target.value)} />;
}

export function DefaultQuestionType() {
  return <div>Wrong Question Type detected. Please, do not proceed</div>;
}
