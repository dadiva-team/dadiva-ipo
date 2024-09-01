import { useNavigate } from 'react-router-dom';
import { Role, Session, useSessionManager } from '../../../session/Session';
import * as React from 'react';
import reduce from '../utils/Reduce';
import { handleError, handleRequest } from '../../../services/utils/fetch';
import { loginNIC } from '../../../services/users/UserServices';
import { SuspensionAccountStatus } from '../../../services/users/models/LoginOutputModel';

export function useLogin(returnTo: string) {
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
    if (state.inputs.nic.length !== 8) {
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
    console.log('res before', res);

    const { token, suspensionAccountStatus } = res;
    if (!token) {
      dispatch({ type: 'error', message: 'Token não encontrado' });
      setError('Token não encontrado');
      setLoading(false);
      return;
    }

    const decodedPayload = JSON.parse(atob(token.split('.')[1]));

    const payload: {
      name: string;
      nic: string;
      perms: string[];
    } = {
      name: decodedPayload.fullName,
      nic: decodedPayload.unique_name,
      perms: decodedPayload.role,
    };

    console.log('Decoded payload', payload);
    console.log('Account status', suspensionAccountStatus);

    const session: Session = {
      name: payload.name,
      nic: Number(payload.nic),
      perms: payload.perms as Role[],
      accountStatus: suspensionAccountStatus as SuspensionAccountStatus,
    };
    console.log(session);

    sessionManager.setSession(session);
    dispatch({ type: 'success' });
    setLoading(false);
    navigate(returnTo);
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
