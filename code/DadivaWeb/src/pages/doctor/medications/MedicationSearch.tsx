import React, { useEffect, useState } from 'react';
import { handleRequest } from '../../../services/utils/fetch';
import { MedicationsServices } from '../../../services/medications/MedicationsServices';
import { Autocomplete, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Uris } from '../../../utils/navigation/Uris';
import DOCTOR_MEDICATION_INFORMATION_COMPLETE = Uris.DOCTOR_MEDICATION_INFORMATION_COMPLETE;

export function MedicationSearch() {
  const [possibleOptions, setPossibleOptions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const nav = useNavigate();

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
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        onChange={(event, newValue) => {
          nav(DOCTOR_MEDICATION_INFORMATION_COMPLETE(newValue));
        }}
        renderInput={params => <TextField {...params} label="Medicamentos" />}
        multiple={false}
        options={possibleOptions}
      />
    </div>
  );
}
