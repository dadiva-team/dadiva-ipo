import { useEffect, useState } from 'react';
import { handleError, handleRequest } from '../../../services/utils/fetch';
import { TermsServices } from '../../../services/terms/TermsServices';
import { useNavigate } from 'react-router-dom';
import { Terms } from '../../../domain/Terms/Terms';
import { useCurrentSession } from '../../../session/Session';

export function useEditTermsPage() {
  const user = useCurrentSession();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [termsFetchData, setTermsFetchData] = useState<Terms>();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const nav = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const [termError, termsRes] = await handleRequest(TermsServices.getTerms());
      if (termError) {
        handleError(termError, setError, nav);
        return;
      }
      setTermsFetchData(termsRes);
      setIsLoading(false);
    };

    if (isLoading) fetch();
  }, [isLoading, nav]);

  async function submitTerms(terms: string, authors: string[]) {
    const idx = authors.indexOf(user.name);

    if (idx == -1) authors.unshift(user.name);
    else {
      authors.splice(idx, 1);
      authors.unshift(user.name);
    }
    TermsServices.submitTerms(new Terms(terms, authors)).then(res => {
      setIsSubmitted(res);
    });
  }

  return {
    isLoading,
    error,
    setError,
    termsFetchData,
    isSubmitted,
    setIsSubmitted,
    submitTerms,
  };
}
