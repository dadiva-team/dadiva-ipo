import { useNavigate } from 'react-router-dom';
import { Role, Session, useSessionManager } from '../../../session/Session';
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
      setError('O NIC só deve conter numeros');
      return;
    }
    if (state.inputs.nic.length !== 9) {
      dispatch({ type: 'error', message: 'O NIC deve ter 8 dígitos' });
      setError('O NIC deve ter 8 dígitos');
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

    const token = res.token;
    if (!token) {
      dispatch({ type: 'error', message: 'Token não encontrado' });
      setError('Token não encontrado');
      setLoading(false);
      return;
    }
    const payload: {
      name: string;
      nic: number;
      perms: string;
    } = JSON.parse(atob(token.split('.')[1]));
    console.log(atob(token.split('.')[1]));
    console.log(payload);
    const session: Session = {
      name: payload.name,
      nic: payload.nic,
      perms: payload.perms as Role,
    };

    sessionManager.setSession(session);
    dispatch({ type: 'success' });
    setLoading(false);
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
