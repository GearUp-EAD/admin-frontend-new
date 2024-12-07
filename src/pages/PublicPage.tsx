// PublicPage.tsx
import React, { useEffect } from 'react';
import { getIdToken } from '../context/ProtectedRoutes';
import {login} from '../context/ProtectedRoutes';

const PublicPage = () => {
  useEffect(() => {
    // Move token logging inside useEffect to run after mounting
    const token = getIdToken();
    console.log('get id token', token);
  }, []); // Empty dependency array ensures it runs once

  return (
    <div>
      <h1>Public Page</h1>
      {/* Rest of your component */}

      <button onClick={login}>Login</button>
    </div>
  );
};

export default PublicPage;