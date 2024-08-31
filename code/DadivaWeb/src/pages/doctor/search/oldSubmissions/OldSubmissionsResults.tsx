/*import React, { useState } from 'react';
import ViewListIcon from '@mui/icons-material/ViewList';
import GridViewIcon from '@mui/icons-material/GridView';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import {
  Box,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  SelectChangeEvent,
  IconButton,
} from '@mui/material';
import { SubmissionHistoryModel } from '../../../../services/doctors/models/SubmissionHistoryOutputModel';
import { OldSubmissionCard } from './OldSubmissionCard';

interface OldSubmissionsPendingProps {
  submissions: SubmissionHistoryModel[];
  loadMoreSubmissions: () => void;
  hasMoreSubmissions: boolean;
}

export function OldSubmissionsResults({
  submissions,
  loadMoreSubmissions,
  hasMoreSubmissions,
}: OldSubmissionsPendingProps) {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [statusFilter, setStatusFilter] = useState<'approved' | 'rejected' | 'all'>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [filtersVisible, setFiltersVisible] = useState<boolean>(true);

  const handleViewModeChange = (event: React.MouseEvent<HTMLElement>, newViewMode: 'list' | 'grid') => {
    setViewMode(newViewMode);
  };

  const handleStatusFilterChange = (event: SelectChangeEvent<'approved' | 'rejected' | 'all'>) => {
    setStatusFilter(event.target.value as 'approved' | 'rejected' | 'all');
  };

  const handleYearFilterChange = (event: SelectChangeEvent<string>) => {
    setYearFilter(event.target.value);
  };

  const toggleFiltersVisibility = () => {
    setFiltersVisible(!filtersVisible);
  };

  const filteredSubmissions = Array.from(submissions.values()).filter(submission => {
    const statusMatches = statusFilter === 'all' || submission.status === statusFilter;
    const yearMatches =
      yearFilter === 'all' || new Date(submission.submissionDate).getFullYear().toString() === yearFilter;
    return statusMatches && yearMatches;
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Submissões Antigas</Typography>
        <IconButton onClick={toggleFiltersVisibility}>
          {filtersVisible ? <FilterAltOffIcon /> : <FilterAltIcon />}
        </IconButton>
      </Box>
      {filtersVisible && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120, mr: 2 }}>
            <InputLabel id="status-filter-label">Estado</InputLabel>
            <Select
              labelId="status-filter-label"
              value={statusFilter}
              onChange={handleStatusFilterChange}
              label="Status"
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="approved">Aprovado ✅</MenuItem>
              <MenuItem value="rejected">Rejeitado ❌</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120, mr: 2 }}>
            <InputLabel id="year-filter-label">Ano</InputLabel>
            <Select labelId="year-filter-label" value={yearFilter} onChange={handleYearFilterChange} label="Ano">
              <MenuItem value="all">-</MenuItem>
              {Array.from(
                new Set(
                  Array.from(submissions.values()).map(sub => new Date(sub.submissionDate).getFullYear().toString())
                )
              ).map(year => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            aria-label="view mode"
            sx={{ ml: 'auto' }}
            size="small"
          >
            <ToggleButton value="list" aria-label="list view">
              <ViewListIcon />
            </ToggleButton>
            <ToggleButton value="grid" aria-label="grid view">
              <GridViewIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      )}
      <Box
        sx={{
          display: viewMode === 'grid' ? 'grid' : 'block',
          gridTemplateColumns: viewMode === 'grid' ? 'repeat(2, 1fr)' : 'none',
          gap: 2,
        }}
      >
        {filteredSubmissions.map((submission, index) => (
          <Box key={index}>
            <OldSubmissionCard
              submission={submission}
              group={submissions.get(submission)!}
              inconsistencies={inconsistencies}
            />
          </Box>
        ))}
      </Box>
      <Button onClick={loadMoreSubmissions} disabled={!hasMoreSubmissions} variant="contained" sx={{ mt: 2 }}>
        {hasMoreSubmissions ? 'Carregar mais' : 'Não há mais submissões'}
      </Button>
    </Box>
  );
}*/
