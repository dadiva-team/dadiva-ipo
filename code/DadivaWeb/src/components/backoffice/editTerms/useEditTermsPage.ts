import { useEffect, useState } from 'react';
import { handleError, handleRequest } from '../../../services/utils/fetch';
import { TermsServices } from '../../../services/terms/TermsServices';
import { useNavigate } from 'react-router-dom';
import { Terms } from '../../../domain/Terms/Terms';
import { UpdateTermsOutputModel } from '../../../services/terms/models/UpdateTermsOutputModel';

export function useEditTermsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [termsFetchData, setTermsFetchData] = useState<Terms[]>();
  const [selectedTermId, setSelectedTermId] = useState<number>();
  const [content, setContent] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const [isSubmitted, setIsSubmitted] = useState(false);

  const nav = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const [termError, termsRes] = await handleRequest(TermsServices.getTerms());
      if (termError) {
        handleError(termError, setError, nav);
        return;
      }
      console.log('fetched new terms');
      setTermsFetchData(termsRes);
      const activeTerm = termsRes.find(term => term.isActive === true);
      setSelectedTermId(activeTerm.id);
      setContent(activeTerm.content);
      setIsLoading(false);
    };

    if (isLoading) fetch();
  }, [isLoading, nav]);

  function handleTermClick(termId: number) {
    setSelectedTermId(termId);
    const selectedTerm = termsFetchData.find(term => term.id === termId);
    if (selectedTerm) {
      setContent(selectedTerm.content);
    }
  }

  async function handleUpdateTermRequest(termId: number, content: string, author: number) {
    const termUpdate: UpdateTermsOutputModel = {
      updatedBy: author,
      newContent: content,
    };
    TermsServices.updateTerms(termId, termUpdate).then(res => {
      if (res == true) {
        setIsLoading(true);
      }
      setIsSubmitted(res);
    });
  }

  return {
    isLoading,
    setIsLoading,
    error,
    setError,
    termsFetchData,
    selectedTermId,
    content,
    setContent,
    isSubmitted,
    setIsSubmitted,
    handleTermClick,
    handleUpdateTermRequest,
    sidebarOpen,
    setSidebarOpen,
  };
}
