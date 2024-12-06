// PublicPage.tsx
import React, { useEffect } from 'react';
import { getIdToken } from '../context/ProtectedRoutes';

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
    </div>
  );
};

export default PublicPage;