import React, { useState } from 'react';
import { Box, FormControl, IconButton, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import Typography from '@mui/material/Typography';
import { useLanguage } from '../../components/backoffice/LanguageProvider';
import { useTranslation } from 'react-i18next';

export function SettingsPage() {
  const { t } = useTranslation();
  const { backofficeLanguage, changeLanguage } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState(backofficeLanguage);

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    const newLanguage = event.target.value;
    setSelectedLanguage(newLanguage);
    changeLanguage(newLanguage);
  };

  return (
    <Box style={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h5" sx={{ mb: 5 }}>
        {t('Settings')}
      </Typography>
      <Typography>{t('Choose Language for Backoffice')}</Typography>
      <Box sx={{ flexDirection: 'row', display: 'flex', alignItems: 'center', marginLeft: '20px', mt: 2 }}>
        <IconButton>
          <LanguageIcon />
        </IconButton>
        <FormControl sx={{ minWidth: 120, marginBottom: '20px' }}>
          <Select
            labelId="language-selector-label"
            id="language-selector"
            value={selectedLanguage}
            onChange={handleLanguageChange}
          >
            <MenuItem value="En">English</MenuItem>
            <MenuItem value="Pt">Português</MenuItem>
          </Select>
        </FormControl>
        <Box />
      </Box>
    </Box>
  );
}
