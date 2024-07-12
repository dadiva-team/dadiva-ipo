import React from 'react';
import LoadingSpinner from '../../shared/LoadingSpinner';
import { ErrorAlert } from '../../shared/ErrorAlert';
import { Box, Button } from '@mui/material';
import { UserLayout } from './UserLayout';
import { useManageUsers } from './useManageUsers';
import { DeleteConfirmDialog } from '../../shared/DeleteConfirmDialog';
import { useCurrentSession } from '../../../session/Session';
import { CreateUserDialog } from './dialogs/CreateUserDialog';

export function ManageUsersPage() {
  const {
    isLoading,
    error,
    setError,
    nics,
    isDeleting,
    setIsDeleting,
    handleDeleteUser,
    handleCreateUser,
    isCreating,
    setIsCreating,
  } = useManageUsers();
  const currentUserNic = useCurrentSession().nic;
  return (
    <div>
      {isLoading ? (
        <Box sx={{ mt: 1 }}>
          <LoadingSpinner text="A carregar os utilizadores..." />
          <ErrorAlert error={error} clearError={() => setError(null)} />
        </Box>
      ) : (
        <>
          <Button
            onClick={() => {
              setIsCreating(true);
            }}
          >
            {' '}
            Create User{' '}
          </Button>
          <CreateUserDialog
            open={isCreating}
            onAnswer={handleCreateUser}
            onClose={() => {
              setIsCreating(false);
            }}
          />
          {nics.map(nic => {
            return (
              <UserLayout
                key={nic}
                isDisabled={nic.toString() === currentUserNic.toString()}
                nic={nic}
                onDeleteRequest={() => setIsDeleting(nic)}
              />
            );
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
