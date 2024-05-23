import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleRequest } from '../../../services/utils/fetch';
import { getUsers } from '../../../services/users/UserServices';

export function useManageUsers() {
  const [isLoading, setIsLoading] = useState(true);
  const nav = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [nics, setNics] = useState<number[]>([]);

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
      setNics(res.map(u => u.nic));
      setIsLoading(false);
    };

    if (isLoading) fetch();
  }, [isLoading, nav]);

  function handleDeleteUser(nic: number) {
    console.log('Deleting user ' + nic);
    return;
  }

  return {
    isLoading,
    error,
    setError,
    nics,
    handleDeleteUser,
  };
}
