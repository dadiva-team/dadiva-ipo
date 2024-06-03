import React from 'react';
import { Box, Button, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from '@mui/material/CircularProgress';

interface DonorSearchNicProps {
  nic: string;
  setNic: (nic: string) => void;
  handleSearch: () => void;
  isSearching?: boolean;
}

export function DonorSearchNic({ nic, setNic, handleSearch, isSearching }: DonorSearchNicProps) {
  const handleChange = (value: React.ChangeEvent<HTMLInputElement>) => {
    setNic(value.target.value);
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
        type={'number'}
        required
        rows={2}
        onChange={handleChange}
        label="Introduza o NIC do dador"
        sx={{ mr: 2, width: '80%' }}
      />
      <Button
        variant="outlined"
        onClick={() => handleSearch()}
        startIcon={isSearching ? <CircularProgress size={24} /> : <SearchIcon />}
        disabled={nic?.length < 8 || isSearching}
        sx={{ borderRadius: 50 }}
      >
        {!isSearching && "Pesquisar"}
      </Button>
    </Box>
  );
}