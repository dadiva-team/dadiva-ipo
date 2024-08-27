import React, { forwardRef } from 'react';
import JoditEditor, { Jodit } from 'jodit-react';

interface EditorProps {
  initialState: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  setIsSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}

const Editor = forwardRef(
  ({ initialState, setContent, setIsSubmitted }: EditorProps, ref: React.ForwardedRef<Jodit>) => {
    /*Jodit.defaultOptions.controls.language = {
      name: 'Select Language',
      list: {
        En: 'English',
        Pt: 'Português',
      },
      exec: (editor, _, { control }) => {
        const selectedLanguage = ;
        setLanguage(selectedLanguage);
      },
    };*/

    const config = {
      readonly: false,
      height: 500,
      showCharsCounter: false,
      showWordsCounter: false,
      showXPathInStatusbar: false,
      toolbarAdaptive: false,
      toolbarSticky: true,
      buttons: [
        'bold',
        'italic',
        'underline',
        'strikethrough',
        '|',
        'superscript',
        'subscript',
        '|',
        'font',
        'fontsize',
        '|',
        'paragraph',
        'align',
        '|',
        'ul',
        'ol',
        'outdent',
        'indent',
        '|',
        'brush',
        'table',
        '|',
        'link',
        'image',
        '|',
        'undo',
        'redo',
        '|',
        'selectall',
        'cut',
        'copy',
        'paste',
        '|',
        'eraser',
        'hr',
        '|',
        'language',
      ],
      textIcons: false,
    };

    return (
      <JoditEditor
        ref={ref}
        value={initialState ?? ' '}
        config={config}
        onBlur={newContent => {
          setContent(newContent);
        }}
        onChange={() => {
          setIsSubmitted(false);
        }}
      />
    );
  }
);

Editor.displayName = 'Editor';
export default Editor;
