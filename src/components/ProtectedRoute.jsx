import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        // You could replace this with a nice spinner later
        return <div className="loading-screen">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
