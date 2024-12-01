import React, { createContext, useEffect, useState } from 'react';
import keycloak from './keycloak';

export const AuthContext = createContext();

const KeycloakProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    keycloak.init({ onLoad: 'login-required' }).then((authenticated) => {
      setIsAuthenticated(authenticated);
    });
  }, []);

  const logout = async () => {
    try {
      // Specify redirect URL after logout (optional)
      const logoutOptions = {
        redirectUri: window.location.origin, // Redirect to app's root
      };

      // Clear local tokens and session
      await keycloak.logout(logoutOptions);
      
      // Reset auth state
      setIsAuthenticated(false);
      
      // Clear any application state/storage if needed
      localStorage.removeItem('user-settings'); // Example
    } catch (error) {
      console.error('Logout failed:', error);
      // Handle logout failure - show user feedback
    }
  };

  return (
    <AuthContext.Provider value={{ keycloak, isAuthenticated, logout }}>
      {isAuthenticated ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

export default KeycloakProvider;
