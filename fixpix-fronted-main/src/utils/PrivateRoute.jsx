import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
    let { user, loading } = useContext(AuthContext);

    // If still checking session, show nothing (or we could show a Spinner)
    // This stops the page from "flickering" or redirecting before session is ready
    if (loading) {
        return null; 
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute;
