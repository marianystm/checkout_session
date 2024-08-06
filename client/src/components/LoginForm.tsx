import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext'; 

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const { login, logout, isLoggedIn } = useAuth(); 

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/login", {
        email,
        password,
      }, { withCredentials: true });
      if (response.data) {
        login(); 
        setMessage(response.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Ett fel inträffade!");
      }
      logout();  
    }
  };

  const handleLogout = () => {
    setEmail("");
    setPassword("");
    logout();  
    setMessage("Du har loggats ut.");
  };

  return (
    <div>
      {!isLoggedIn ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label>E-post:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label>Lösenord:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit">Logga in</button>
          <p>{message}</p>
        </form>
      ) : (
        <div>
          <p>Du är inloggad!</p>
          <button onClick={handleLogout}>Logga ut</button>
        </div>
      )}
    </div>
  );
};
