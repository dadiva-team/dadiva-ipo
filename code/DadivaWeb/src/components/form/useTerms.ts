import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleRequest } from '../../services/utils/fetch';
import { TermsServices } from '../../services/terms/TermsServices';

export function useTerms() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [terms, setTerms] = useState<string>();
  const nav = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const [termsError, termsRes] = await handleRequest(TermsServices.getTerms());
      if (termsError) {
        handleError(termsError, setError, nav);
        return;
      }
      setTerms(termsRes.terms);

      console.log('Terms in useTerms : ' + termsRes);
      setIsLoading(false);
    };

    if (isLoading) fetch();
  }, [isLoading, nav]);

  return {
    isLoading,
    error,
    setError,
    terms,
    nav,
  };
}
