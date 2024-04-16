import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../searchBar/SearchBar';

export default function Home() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>PLACEHOLDER</h1>
      <SearchBar />
      <button
        type="button"
        value="LOGIN"
        onClick={() => navigate('/login')}
        style={{ display: 'block', marginBottom: '10px' }}
      >
        LOGIN
      </button>
      <button
        type="button"
        value="REGISTER"
        onClick={() => navigate('/register')}
        style={{ display: 'block', marginBottom: '10px' }}
      >
        REGISTER
      </button>
      <button value="FORM" onClick={() => navigate('/form')} style={{ display: 'block', marginBottom: '10px' }}>
        FORM
      </button>
      <button value="FORM" onClick={() => navigate('/forma')} style={{ display: 'block', marginBottom: '10px' }}>
        FORM
      </button>
      <button value="FORM" onClick={() => navigate('/formaa')} style={{ display: 'block', marginBottom: '10px' }}>
        FORM
      </button>
    </div>
  );
}
