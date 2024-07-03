import { useEffect, useState } from 'react';
import { handleError, handleRequest } from '../../../services/utils/fetch';
import { FormServices } from '../../../services/from/FormServices';
import { useNavigate } from 'react-router-dom';

export function useEditTermsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [termsFetchData, setTermsFetchData] = useState<string>();

  const nav = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const [termError, termsRes] = await handleRequest(FormServices.getTerms());
      if (termError) {
        handleError(termError, setError, nav);
        return;
      }
      setTermsFetchData(termsRes);

      console.log(termsRes);
      setIsLoading(false);
    };

    if (isLoading) fetch();
  }, [isLoading, nav]);

  return {
    isLoading,
    error,
    setError,
    termsFetchData,
  };
}
