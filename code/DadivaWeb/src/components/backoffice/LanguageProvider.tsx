import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  backofficeLanguage: string;
  changeLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [backofficeLanguage, setBackofficeLanguage] = useState('Pt');

  const changeLanguage = (lang: string) => {
    setBackofficeLanguage(lang);
  };

  return <LanguageContext.Provider value={{ backofficeLanguage, changeLanguage }}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
