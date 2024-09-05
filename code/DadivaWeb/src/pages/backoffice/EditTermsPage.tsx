import React, { useRef, useEffect } from 'react';
import { useEditTermsPage } from '../../components/backoffice/editTerms/useEditTermsPage';
import { Box, Button, IconButton, Typography } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { ErrorAlert } from '../../components/shared/ErrorAlert';
import Editor from '../../components/backoffice/editTerms/Editor';
import { Jodit } from 'jodit-react';
import Sidebar from '../../components/backoffice/editTerms/Sidebar';
import './EditTermsPage.css';
import { useTranslation } from 'react-i18next';

export function EditTermsPage() {
  const {
    isLoading,
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
  } = useEditTermsPage();
  const { t } = useTranslation();
  const editorRef = useRef<Jodit>();

  useEffect(() => {
    console.log('sidebarOpen changed: ' + sidebarOpen);
  }, [sidebarOpen]);

  return (
    <div>
      {isLoading ? (
        <Box sx={{ mt: 1 }}>
          <LoadingSpinner text={'A carregar os termos e condições...'} />
          <ErrorAlert error={error} clearError={() => setError(null)} />
        </Box>
      ) : (
        <div>
          <div className={`main-content ${sidebarOpen ? 'shifted' : ''}`}>
            <div className="toolbar">
              <Typography variant="h6" gutterBottom>
                Editor
              </Typography>
              <IconButton
                onClick={() => {
                  setSidebarOpen(!sidebarOpen);
                }}
              >
                {sidebarOpen ? <ArrowForwardIosIcon /> : <ArrowBackIosNewIcon />}
              </IconButton>
            </div>

            <div style={{ padding: '10px' }}>
              <Editor ref={editorRef} initialState={content} setContent={setContent} setIsSubmitted={setIsSubmitted} />
              <Button disabled={isSubmitted} onClick={() => handleUpdateTermRequest(content)}>
                {isSubmitted ? t('Submitted') : t('Submit Terms')}
              </Button>
            </div>
          </div>

          <Sidebar
            terms={termsFetchData}
            open={sidebarOpen}
            onTermClick={handleTermClick}
            selectedTermIdx={selectedTermIdx}
          />
        </div>
      )}
    </div>
  );
}
