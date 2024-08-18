import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleRequest } from '../../services/utils/fetch';
import { TermsServices } from '../../services/terms/TermsServices';
import { useTranslation } from 'react-i18next';

export function useTerms() {
  const { i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [terms, setTerms] = useState<string>();
  const nav = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const [termsError, termsRes] = await handleRequest(TermsServices.getActiveTerms(i18n.language));
      if (termsError) {
        handleError(termsError, setError, nav);
        return;
      }
      setTerms(termsRes.content);

      console.log('Terms in useTerms : ' + termsRes.content);
      setIsLoading(false);
    };

    if (isLoading) fetch();
  }, [i18n.language, isLoading, nav]);

  return {
    isLoading,
    error,
    setError,
    terms,
    nav,
  };
}
