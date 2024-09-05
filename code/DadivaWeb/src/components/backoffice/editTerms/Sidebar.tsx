import React from 'react';
import { Accordion, AccordionSummary, Typography } from '@mui/material';
import { TermsHistoryItem } from '../../../services/terms/models/TermsHistoryOutputModel';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
  terms: TermsHistoryItem[];
  open: boolean;
  onTermClick: (termId: number) => void;
  selectedTermIdx: number;
}

const Sidebar = ({ terms, open, onTermClick, selectedTermIdx }: SidebarProps) => {
  const { t } = useTranslation();
  return (
    <div className={`sidebar ${open ? 'open' : ''}`}>
      <Typography variant="h6"> {t('All Terms')} </Typography>
      {terms.map((term, index) => (
        <Accordion
          key={index}
          expanded={selectedTermIdx === index}
          onClick={() => onTermClick(index)}
          className={selectedTermIdx === index ? 'accordion-selected' : ''}
        >
          <AccordionSummary>
            <Typography>
              {t('CreatedBy', {
                authorName: term.authorName,
                authorNic: term.authorNic,
                date: term.date,
              })}
            </Typography>
          </AccordionSummary>
        </Accordion>
      ))}
    </div>
  );
};

export default Sidebar;
