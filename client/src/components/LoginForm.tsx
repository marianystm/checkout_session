import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const { login } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/login", {
        email,
        password,
      }, { withCredentials: true });
      if (response.data) {
        login({ email, customerId: response.data.customerId });  // Antag att customerId returneras vid inloggning
        setMessage("Inloggad!");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Ett fel inträffade!");
      }
    }
  };

  return (
    <div>
    <form onSubmit={handleSubmit}>
      <label>
        E-post:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label>
        Lösenord:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <button type="submit">Logga in</button>
      <div>{message}</div>
    </form>
  </div>
  );
};
