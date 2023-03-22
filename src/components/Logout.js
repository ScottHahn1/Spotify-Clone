import React from 'react';
import '../styles/Logout.css';

export const Logout = ({setToken}) => {
    
    const logout = () => {
        setToken('');
        window.localStorage.removeItem('token');
    }

    return (
        <div className='logout-container'>
            <button onClick={logout} id='logout-btn'>Logout</button>
        </div>
    )
}
