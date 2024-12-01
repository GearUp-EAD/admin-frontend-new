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

  return (
    <AuthContext.Provider value={{ keycloak, isAuthenticated }}>
      {isAuthenticated ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

export default KeycloakProvider;
