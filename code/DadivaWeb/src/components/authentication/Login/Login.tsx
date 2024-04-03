import * as React from 'react'
import reduce from '../utils/Reduce'
import './Login.css'
import {Navigate, useNavigate} from 'react-router-dom';
import {handleError, handleRequest} from '../../../services/utils/fetch';
import {loginNIC} from '../../../services/users/UserServices';

export default function Login() {
    const navigate = useNavigate()
    const [error, setError] = React.useState<string | null>(null)
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

        dispatch({type: 'submit'});
        const nic = state.inputs.nic;
        const password = state.inputs.password;

        const [error, res] = await handleRequest(loginNIC(nic, password))
        if (error) {
            handleError(error, setError, navigate)
            dispatch({type: 'error', message: `${error}`});
            return
        }

        if (res === undefined) {
            throw new Error("Response is undefined")
        }
    }

    const nic = state.tag === 'submitting' ? state.nic : state.inputs.nic
    const password = state.tag === 'submitting' ? "" : state.inputs.password

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <h1 className="welcome">Bem-Vindo</h1>
                <p className="login">Entre na sua conta</p>

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
                    <label htmlFor="password" className='password'>Palavra-passe</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                    />
                    <br/>
                    <br/>
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
                {error && <div style={{color: 'red'}}>{error}</div>}
                <div className="alternative">
                    <hr/>
                    <p>Alternativamente</p>
                    <hr/>
                </div>
                <button type="button" className="auth-button">AUTENTICAÇÃO.GOV</button>
            </form>
        </div>
    );
}