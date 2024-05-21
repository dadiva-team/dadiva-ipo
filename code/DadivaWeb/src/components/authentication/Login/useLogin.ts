import { useNavigate } from 'react-router-dom';
import { Session, useSessionManager } from '../../../session/Session';
import * as React from 'react';
import reduce from '../utils/Reduce';
import { handleError, handleRequest } from '../../../services/utils/fetch';
import { loginNIC } from '../../../services/users/UserServices';

export function useLogin() {
  const navigate = useNavigate();
  const sessionManager = useSessionManager();

  const [error, setError] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [state, dispatch] = React.useReducer(reduce, {
    tag: 'editing',
    inputs: { nic: '', password: '' },
  });

  if (state.tag === 'redirect') {
    navigate('/');
    return {};
  }

  function handleChange(ev: React.FormEvent<HTMLInputElement>) {
    dispatch({ type: 'edit', inputName: ev.currentTarget.name, inputValue: ev.currentTarget.value });
  }

  async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (state.tag !== 'editing') {
      return;
    }

    if (isNaN(Number(state.inputs.nic))) {
      dispatch({ type: 'error', message: 'O NIC deve ter só numeros' });
      setError('O NIC deve ter só numeros');
      return;
    }
    if (state.inputs.nic.length !== 9) {
      dispatch({ type: 'error', message: 'O NIC deve ter 9 dígitos' });
      setError('O NIC deve ter 9 dígitos');
      return;
    }

    dispatch({ type: 'submit' });
    setLoading(true);

    const { nic, password } = state.inputs;

    const [error, res] = await handleRequest(loginNIC(nic, password));
    if (error) {
      handleError(error, setError, navigate);
      dispatch({ type: 'error', message: `${error}` });
      setLoading(false);
      return;
    }

    if (res === undefined) {
      setLoading(false);
      throw new Error('Response is undefined');
    }

    // Change to actual data from the backend
    const mockSession: Session = {
      name: 'Mock Name',
      nic: nic,
    };

    sessionManager.setSession(mockSession);
    dispatch({ type: 'success' });
    setLoading(false);
    navigate('/');
  }

  const { nic, password } = state.inputs;

  return {
    error,
    setError,
    nic,
    password,
    showPassword,
    handleChange,
    handleSubmit,
    setShowPassword,
    loading,
  };
}
