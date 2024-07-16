import React from 'react';
import { Accordion, AccordionSummary, Typography } from '@mui/material';
import { Terms } from '../../../domain/Terms/Terms';

interface SidebarProps {
  terms: Terms[];
  open: boolean;
  onTermClick: (termId: number) => void;
  selectedTermId: number;
}

const Sidebar = ({ terms, open, onTermClick, selectedTermId }: SidebarProps) => {
  return (
    <div className={`sidebar ${open ? 'open' : ''}`}>
      <Typography variant="h6"> All terms </Typography>
      {terms.map(term => (
        <Accordion
          key={term.id}
          expanded={selectedTermId === term.id}
          onClick={() => onTermClick(term.id)}
          className={selectedTermId === term.id ? 'accordion-selected' : ''}
        >
          <AccordionSummary>
            <Typography>
              Title: {term.title} - Created by: {term.createdBy} on {new Date(term.createdAt).toLocaleString()}
            </Typography>
          </AccordionSummary>
        </Accordion>
      ))}
    </div>
  );
};

export default Sidebar;
