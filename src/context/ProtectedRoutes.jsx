import { Outlet, Navigate } from 'react-router-dom';

const ProtectedRoutes = () => {
    const user = true; // Simulate an unauthenticated user
    return user ? <Outlet /> : <Navigate to="/login"/>; // Redirect to login if not authenticated
};

export default ProtectedRoutes;