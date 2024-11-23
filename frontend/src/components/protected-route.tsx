import React from 'react';
import { Navigate } from 'react-router-dom';

// ProtectedRoute component that checks if the user is logged in
const ProtectedRoute = ({ element }: { element: React.ReactNode }) => {
    const isLoggedIn = true; // Replace with your authentication logic

    return isLoggedIn ? element : <Navigate to="/mainpage" />;
};

export default ProtectedRoute;
