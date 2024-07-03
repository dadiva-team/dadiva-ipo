import React, { useRef, useState } from 'react';
import { useEditTermsPage } from '../../components/backoffice/editTerms/useEditTermsPage';
import { Box, Button } from '@mui/material';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { ErrorAlert } from '../../components/shared/ErrorAlert';
import JoditEditor from 'jodit-react';
import { FormServices } from '../../services/from/FormServices';
import submitTerms = FormServices.submitTerms;
import { Terms } from '../../domain/Terms/Terms';

export function EditTermsPage() {
  const { isLoading, error, setError, termsFetchData } = useEditTermsPage();

  const editor = useRef(null);
  const [content, setContent] = useState('');

  const config = {
    readonly: false,
    height: 500,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    buttons:
      'bold,italic,underline,strikethrough,eraser,ul,ol,font,fontsize,paragraph,lineHeight,superscript,subscript,file,image,cut,copy,paste,selectall,link, brush, align',
  };

  const handleSubmit = () => {
    submitTerms(new Terms(content));
  };

  return (
    <div>
      {isLoading ? (
        <Box sx={{ mt: 1 }}>
          <LoadingSpinner text={'A carregar os termos e condições...'} />
          <ErrorAlert error={error} clearError={() => setError(null)} />
        </Box>
      ) : (
        <>
          <JoditEditor
            ref={editor}
            value={termsFetchData ?? ''}
            config={config}
            onBlur={newContent => setContent(newContent)}
            onChange={() => {}}
          />
          <div className="Btns">
            <Button onClick={handleSubmit}>Submit Terms</Button>
          </div>
        </>
      )}
    </div>
  );
}
