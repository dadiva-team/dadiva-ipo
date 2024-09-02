import React from 'react';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';
import GridViewIcon from '@mui/icons-material/GridView';
import { ViewMode } from '../search/donorReviews/DonorReviews';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc',
}

interface SubmissionFiltersProps {
  sortOrder: SortOrder;
  layout: ViewMode;
  filtersVisible: boolean;
  selectedDate: Date | null;
  pendingSubmissions: { submissionDate: string }[];
  onSortOrderChange: (newSortOrder: SortOrder) => void;
  onLayoutChange: (newLayout: ViewMode) => void;
  onDateChange: (date: Date | null) => void;
  onToggleFiltersVisibility: () => void;
}

export function SubmissionFilters({
  sortOrder,
  layout,
  filtersVisible,
  selectedDate,
  pendingSubmissions,
  onSortOrderChange,
  onLayoutChange,
  onDateChange,
}: SubmissionFiltersProps) {
  const handleSortOrderChange = (event: React.MouseEvent<HTMLElement>, newSortOrder: SortOrder) => {
    if (newSortOrder !== null) {
      onSortOrderChange(newSortOrder);
    }
  };

  const handleLayoutChange = (event: React.MouseEvent<HTMLElement>, newLayout: ViewMode) => {
    if (newLayout !== null) {
      onLayoutChange(newLayout);
    }
  };

  return (
    <>
      {filtersVisible && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', mb: 2 }}>
          <Typography variant="body1" sx={{ mr: 2 }}>
            Ordenar por:
          </Typography>

          <ToggleButtonGroup
            value={sortOrder}
            exclusive
            onChange={handleSortOrderChange}
            aria-label="sort order"
            size="small"
            sx={{ mr: 2, pr: 10 }}
          >
            <ToggleButton value={SortOrder.Asc} aria-label="ascending">
              <ArrowUpwardIcon sx={{ mr: 1 }} />
              Mais antigos
            </ToggleButton>
            <ToggleButton value={SortOrder.Desc} aria-label="descending">
              <ArrowDownwardIcon sx={{ mr: 1 }} />
              Mais Recentes
            </ToggleButton>
          </ToggleButtonGroup>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Escolha o dia"
              value={selectedDate}
              onChange={onDateChange}
              shouldDisableDate={date => {
                const submissionDates = pendingSubmissions.map(sub => new Date(sub.submissionDate).toDateString());
                return !submissionDates.includes(date.toDateString());
              }}
              slotProps={{ textField: { size: 'small', sx: { mr: 2 } } }}
            />
          </LocalizationProvider>

          <ToggleButtonGroup
            value={layout}
            exclusive
            onChange={handleLayoutChange}
            aria-label="layout"
            sx={{ ml: 'auto' }}
            size="small"
          >
            <ToggleButton value={ViewMode.List} aria-label="list view">
              <ViewListIcon />
            </ToggleButton>
            <ToggleButton value={ViewMode.Grid} aria-label="grid view">
              <GridViewIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      )}
    </>
  );
}
