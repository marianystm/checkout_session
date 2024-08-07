import React from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const LogoutButton: React.FC = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:3000/logout', {}, { withCredentials: true });
      if (response.status === 200) {
        logout();
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return <button onClick={handleLogout}>Logga ut</button>;
};

export default LogoutButton;
