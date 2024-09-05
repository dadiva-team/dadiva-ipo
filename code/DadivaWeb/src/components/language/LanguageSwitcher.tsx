import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, FormControl, IconButton, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language || 'Pt');

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    const language = event.target.value;
    i18n.changeLanguage(language);
    setSelectedLanguage(language);
  };

  return (
    <Box style={{ display: 'flex', alignItems: 'center' }}>
      <IconButton>
        <LanguageIcon />
      </IconButton>
      <FormControl variant="standard" sx={{ ml: 2 }}>
        <Select
          labelId="language-switcher"
          id="language-switcher-select"
          value={selectedLanguage}
          defaultValue={selectedLanguage}
          onChange={event => handleLanguageChange(event)}
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="En">English</MenuItem>
          <MenuItem value="Pt">Português</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default LanguageSwitcher;
