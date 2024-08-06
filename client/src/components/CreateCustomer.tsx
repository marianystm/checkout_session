// RegistrationForm.tsx
import React, { useState } from 'react';
import axios from 'axios';

export const CreateCustomer = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/register', { email, name, password }, { withCredentials: true });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Registrering misslyckades: ');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <label>Namn:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <label>Lösenord:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Registrera</button>
            <div>{message}</div>
        </form>
    );
};
