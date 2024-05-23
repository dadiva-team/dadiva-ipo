import React from 'react';
import LoadingSpinner from '../../shared/LoadingSpinner';
import { ErrorAlert } from '../../shared/ErrorAlert';
import { Box } from '@mui/material';
import { UserLayout } from './UserLayout';
import { useManageUsers } from './useManageUsers';

export function ManageUsersPage() {
  const { isLoading, error, setError, nics, handleDeleteUser } = useManageUsers();

  // Log the nics array to ensure it contains unique numbers
  console.log('NICs:', nics);

  return (
    <div>
      {isLoading ? (
        <Box sx={{ mt: 1 }}>
          <LoadingSpinner text="A carregar os utilizadores..." />
          <ErrorAlert error={error} clearError={() => setError(null)} />
        </Box>
      ) : (
        <>
          {nics.map(nic => {
            console.log('Rendering UserLayout for NIC:', nic); // Log each nic to ensure uniqueness
            return <UserLayout key={nic} nic={nic} onDeleteRequest={handleDeleteUser} />;
          })}
        </>
      )}
    </div>
  );
}
