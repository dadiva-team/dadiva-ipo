import React from 'react';
import { useNavigate } from 'react-router-dom';

export function LogoIPO() {
  const navigate = useNavigate();
  return (
    <img
      className="logo"
      src={'/IPO-logo-transparent.png'}
      alt={'IPO logo'}
      onClick={() => navigate('/')}
      style={{ cursor: 'pointer' }}
    />
  );
}
