import * as React from 'react'
import reduce from '../utils/Reduce'
import './Login.css'
import { Navigate } from 'react-router-dom';

export default function Login() {
    //const [error, setError] = React.useState<string | null>(null)
    const [state, dispatch] = React.useReducer(reduce, {
        tag: 'editing',
        inputs: {nic: '', password: ''}
    })
    const [showPassword, setShowPassword] = React.useState(false)


    if (state.tag === 'redirect') {
        return <Navigate to={'/me'} replace={true}/>;
    }

    function handleChange(ev: React.FormEvent<HTMLInputElement>) {
      dispatch({type: 'edit', inputName: ev.currentTarget.name, inputValue: ev.currentTarget.value});
  }

    async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
      ev.preventDefault();
      if (state.tag !== 'editing') {
          return;
      }
  }
  
    const nic = state.tag === 'submitting' ? state.nic : state.inputs.nic
    const password = state.tag === 'submitting' ? "" : state.inputs.password
  
    return (
      <div className="login-container">
        <form onSubmit={handleSubmit}>
          <h1 className ="welcome">Bem-Vindo</h1>
          <p>Entre na sua conta</p>
  
          <div className="input-group">
            <label htmlFor="nic" className='nic'>NIC</label>
            <input
              type="text"
              id="nic"
              name="nic"
              value={nic}
              onChange={handleChange}
              />
          </div>
  
          <div className="input-group">
            <label htmlFor="password" className= 'password'>Palavra-passe</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
            />
            <br />
                <br />
                <label htmlFor="check">Mostrar Password</label>
                <input
                    id="check"
                    type="checkbox"
                    onChange={() =>
                        setShowPassword((prev) => !prev)
                    }
                />
          </div>
  
          <button type="submit" className="login-button">Entrar</button>
      
          <div className="alternative">
            <hr />
            <p>Alternativamente</p>
            <hr />
          </div>
  
          <button type="button" className="auth-button">AUTENTICAÇÃO.GOV</button>
        </form>
      </div>
    );
  }