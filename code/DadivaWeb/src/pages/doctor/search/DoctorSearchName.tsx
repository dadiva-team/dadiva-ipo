import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export function DonorSearchName() {
  const [name, setName] = useState<string>(null);
  const handleChange = (value: React.ChangeEvent<HTMLInputElement>) => {
    setName(value.target.value);
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
        type={'text'}
        required
        rows={1}
        onChange={handleChange}
        label="Introduza o Nome do dador"
        sx={{ mr: 2, width: '80%' }}
      />
      <Button
        variant="outlined"
        onClick={() => console.log("Search for donor with name: ", name)}
        startIcon={<SearchIcon />}
        disabled={name?.length === 0}
        sx={{ borderRadius: 50 }}
      >
        Pesquisar
      </Button>
    </Box>
  );
}