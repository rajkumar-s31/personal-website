import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../app/AuthContext";

export default function ProtectedRoute({ children }) {
    const { user, isAuthLoading } = useAuth();
    const location = useLocation();

    if (isAuthLoading) {
        return null;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}
