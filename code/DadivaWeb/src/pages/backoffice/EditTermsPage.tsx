import React, { useRef, useState } from 'react';
import { useEditTermsPage } from '../../components/backoffice/editTerms/useEditTermsPage';
import { Box, Button } from '@mui/material';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { ErrorAlert } from '../../components/shared/ErrorAlert';
import Editor from '../../components/backoffice/editTerms/Editor';
import Typography from '@mui/material/Typography';
import { Jodit } from 'jodit-react';

export function EditTermsPage() {
  const { isLoading, error, setError, termsFetchData, isSubmitted, setIsSubmitted, submitTerms } = useEditTermsPage();
  const [content, setContent] = useState('');
  const editorRef = useRef<Jodit>();

  return (
    <div>
      {isLoading ? (
        <Box sx={{ mt: 1 }}>
          <LoadingSpinner text={'A carregar os termos e condições...'} />
          <ErrorAlert error={error} clearError={() => setError(null)} />
        </Box>
      ) : (
        <>
          <Editor
            ref={editorRef}
            initialState={termsFetchData ? termsFetchData.terms : ' '}
            setContent={setContent}
            setIsSubmitted={setIsSubmitted}
          />
          <Button
            disabled={isSubmitted}
            onClick={() => {
              submitTerms(content, termsFetchData.authors);
              editorRef.current && editorRef.current.focus(); // Ensure focus after submit
            }}
          >
            {isSubmitted ? 'Submitted' : 'Submit Terms'}
          </Button>
          <Typography>
            Authors:
            {termsFetchData?.authors.map(author => ` ${author}`)}
          </Typography>
        </>
      )}
    </div>
  );
}
