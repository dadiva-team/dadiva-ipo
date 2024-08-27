import { useEffect, useState } from 'react';
import { handleError, handleRequest } from '../../../services/utils/fetch';
import { TermsServices } from '../../../services/terms/TermsServices';
import { useNavigate } from 'react-router-dom';
import { UpdateTermsOutputModel } from '../../../services/terms/models/UpdateTermsOutputModel';
import { TermsHistoryItem } from '../../../services/terms/models/TermsHistoryOutputModel';
import { useTranslation } from 'react-i18next';

export function useEditTermsPage() {
  const { i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [termsFetchData, setTermsFetchData] = useState<TermsHistoryItem[]>();
  const [selectedTermIdx, setSelectedTermIdx] = useState<number>(0);
  const [content, setContent] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [isSubmitted, setIsSubmitted] = useState(false);

  const nav = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const [termError, termsRes] = await handleRequest(TermsServices.getTerms(i18n.language));
      if (termError) {
        handleError(termError, setError, nav);
        return;
      }
      console.log('fetched new terms');
      console.log(termsRes);
      setTermsFetchData(termsRes.history);
      console.log(termsRes.history[0]);
      setContent(termsRes.history[0].content);
      setIsLoading(false);
    };

    if (isLoading) fetch();
  }, [isLoading, nav, i18n.language]);

  i18n.on('languageChanged', () => {
    setIsLoading(true);
  });

  function handleTermClick(termIdx: number) {
    setSelectedTermIdx(termIdx);
    const selectedTerm = termsFetchData[termIdx];
    if (selectedTerm) {
      setContent(selectedTerm.content);
    }
  }

  async function handleUpdateTermRequest(content: string, reason: string = null) {
    const termUpdate: UpdateTermsOutputModel = {
      content: content,
      language: i18n.language,
      reason: reason,
    };
    console.log('useEditTermsPage - handleUpdateTermRequest');
    TermsServices.updateTerms(termUpdate).then(res => {
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
    selectedTermIdx,
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
