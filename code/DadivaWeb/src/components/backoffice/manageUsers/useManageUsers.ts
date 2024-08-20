import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleRequest } from '../../../services/utils/fetch';
import { getUsers, register } from '../../../services/users/UserServices';

export function useManageUsers() {
  const [isLoading, setIsLoading] = useState(true);
  const nav = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [nics, setNics] = useState<number[]>([]);
  const [isDeleting, setIsDeleting] = useState<number>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  useEffect(() => {
    const fetch = async () => {
      console.log('Fetching users');
      const [error, res] = await handleRequest(getUsers());
      console.log('Error: ' + error);
      console.log('Users: ', res);
      if (error) {
        handleError(error, setError, nav);
        return;
      }
      console.log(res);
      setNics(res.nics);
      setIsLoading(false);
    };

    if (isLoading) fetch();
  }, [isLoading, nav]);

  function handleDeleteUser(nic: number) {
    console.log('Deleting user ' + nic);
    return;
  }

  function handleCreateUser(nic: string, password: string, name: string, role: string) {
    register(nic, password, name, role).then(res => {
      if (res) {
        setIsCreating(false);
        setIsLoading(true);
      }
    });
    return;
  }

  return {
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
  };
}
