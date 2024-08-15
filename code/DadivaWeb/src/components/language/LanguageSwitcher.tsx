import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    console.log('LanguageSwitcher setting language: ' + lng);
    i18n.changeLanguage(lng);
  };

  return (
    <div>
      <button disabled={i18n.language == 'En'} onClick={() => changeLanguage('En')}>
        English
      </button>
      <button disabled={i18n.language == 'Pt'} onClick={() => changeLanguage('Pt')}>
        Português
      </button>
    </div>
  );
};

export default LanguageSwitcher;
