import React from 'react';
import LoadingSpinner from '../../shared/LoadingSpinner';
import { ErrorAlert } from '../../shared/ErrorAlert';
import { Box } from '@mui/material';
import { UserLayout } from './UserLayout';
import { useManageUsers } from './useManageUsers';
import { DeleteConfirmDialog } from '../../shared/DeleteConfirmDialog';

export function ManageUsersPage() {
  const { isLoading, error, setError, nics, isDeleting, setIsDeleting, handleDeleteUser } = useManageUsers();

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
            console.log('Rendering UserLayout for NIC:', nic);
            return <UserLayout key={nic} nic={nic} onDeleteRequest={() => setIsDeleting(nic)} />;
          })}
          <DeleteConfirmDialog
            title="Apagar Utilizador"
            confirmationText="Tem a certeza que deseja apagar este utilizador"
            open={isDeleting != null}
            deletedText={`${isDeleting}`}
            onAnswer={del => {
              if (del) handleDeleteUser(isDeleting);
            }}
            onClose={() => setIsDeleting(null)}
          />
        </>
      )}
    </div>
  );
}
