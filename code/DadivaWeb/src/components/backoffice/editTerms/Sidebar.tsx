import React from 'react';
import { Accordion, AccordionSummary, Typography } from '@mui/material';
import { TermsHistoryItem } from '../../../services/terms/models/TermsHistoryOutputModel';

interface SidebarProps {
  terms: TermsHistoryItem[];
  open: boolean;
  onTermClick: (termId: number) => void;
  selectedTermIdx: number;
}

const Sidebar = ({ terms, open, onTermClick, selectedTermIdx }: SidebarProps) => {
  return (
    <div className={`sidebar ${open ? 'open' : ''}`}>
      <Typography variant="h6"> All terms </Typography>
      {terms.map((term, index) => (
        <Accordion
          key={index}
          expanded={selectedTermIdx === index}
          onClick={() => onTermClick(index)}
          className={selectedTermIdx === index ? 'accordion-selected' : ''}
        >
          <AccordionSummary>
            <Typography>
              Created by: {term.authorName} - {term.authorNic} on {term.date}
            </Typography>
          </AccordionSummary>
        </Accordion>
      ))}
    </div>
  );
};

export default Sidebar;
