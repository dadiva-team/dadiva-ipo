import React, { useState } from 'react';
import ViewListIcon from '@mui/icons-material/ViewList';
import GridViewIcon from '@mui/icons-material/GridView';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import {
  Box,
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
import { UserSuspension } from '../../../../domain/User/UserSuspension';
import { SuspensionType } from '../../../../services/users/models/LoginOutputModel';
import { DonorSuspensionHistoryCard } from './DonorSuspensionHistoryCard';

type FilterStatus = SuspensionType | 'all';

export enum ViewMode {
  List = 'list',
  Grid = 'grid',
}

interface DonorSuspensionHistoryProps {
  suspensions: UserSuspension[];
}

export function DonorSuspensionHistory({ suspensions }: DonorSuspensionHistoryProps) {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Grid);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [filtersVisible, setFiltersVisible] = useState<boolean>(true);

  const handleViewModeChange = (event: React.MouseEvent<HTMLElement>, newViewMode: ViewMode) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  const handleStatusFilterChange = (event: SelectChangeEvent<FilterStatus>) => {
    setStatusFilter(event.target.value as FilterStatus);
  };

  const handleYearFilterChange = (event: SelectChangeEvent<string>) => {
    setYearFilter(event.target.value);
  };

  const toggleFiltersVisibility = () => {
    setFiltersVisible(!filtersVisible);
  };

  const filteredSuspensions = suspensions?.filter(suspension => {
    const statusMatches = statusFilter === 'all' || suspension.suspensionType === statusFilter;
    const yearMatches =
      yearFilter === 'all' || new Date(suspension.suspensionStartDate).getFullYear().toString() === yearFilter;
    return statusMatches && yearMatches;
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Histórico de Suspensões</Typography>
        <IconButton onClick={toggleFiltersVisibility}>
          {filtersVisible ? <FilterAltOffIcon /> : <FilterAltIcon />}
        </IconButton>
      </Box>
      {filtersVisible && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120, mr: 2 }}>
            <InputLabel id="status-filter-label">Tipo</InputLabel>
            <Select
              labelId="status-filter-label"
              value={statusFilter}
              onChange={handleStatusFilterChange}
              label="Status"
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value={SuspensionType.Permanent}>Permanente</MenuItem>
              <MenuItem value={SuspensionType.BetweenBloodDonations}>Entre Dadivas</MenuItem>
              <MenuItem value={SuspensionType.BetweenReviewAndDonation}>Entre Revisão e Dadiva</MenuItem>
              <MenuItem value={SuspensionType.PendingReview}>Pendente de Revisão</MenuItem>
              <MenuItem value={SuspensionType.Other}>Outro</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120, mr: 2 }}>
            <InputLabel id="year-filter-label">Ano</InputLabel>
            <Select labelId="year-filter-label" value={yearFilter} onChange={handleYearFilterChange} label="Ano">
              <MenuItem value="all">-</MenuItem>
              {Array.from(
                new Set(
                  suspensions.map(suspension => new Date(suspension.suspensionStartDate).getFullYear().toString())
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
            onChange={(event, newViewMode) => handleViewModeChange(event, newViewMode)}
            aria-label="view mode"
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
      <Box
        sx={{
          display: viewMode === ViewMode.Grid ? 'grid' : 'block',
          gridTemplateColumns: viewMode === ViewMode.Grid ? 'repeat(2, 1fr)' : 'none',
          gap: 2,
        }}
      >
        {filteredSuspensions.map((suspension, index) => (
          <Box key={index}>
            <DonorSuspensionHistoryCard
              suspension={suspension}
              isLastSuspension={index === filteredSuspensions.length - 1}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
