import React from "react";
import {useNavigate} from "react-router-dom";

export default function Home() {
    const navigate=useNavigate()
    return (
        <div>
            <h1>PLACEHOLDER</h1>
            <button
                type="button"
                value="LOGIN"
                onClick={()=>navigate('/login')}
                style={{ display: 'block', marginBottom: '10px' }}
            >
                LOGIN
            </button>
            <button
                type="button"
                value="REGISTER"
                onClick={()=>navigate('/register')}
                style={{ display: 'block', marginBottom: '10px' }}
            >
                REGISTER
            </button>
            <button
                value="FORM"
                onClick={()=>navigate('/form')}
                style={{ display: 'block', marginBottom: '10px' }}
            >
                FORM
            </button>
        </div>
    )
}