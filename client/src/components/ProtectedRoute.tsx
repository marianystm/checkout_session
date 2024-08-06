import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    // Omdirigera till login-sidan, men spara den aktuella platsen de försöker nå
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;  // Rendera barnkomponenterna om användaren är inloggad
};

export default ProtectedRoute;
