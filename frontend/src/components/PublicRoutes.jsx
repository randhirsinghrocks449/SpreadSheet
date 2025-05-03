import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const PublicRoute = ({ children }) => {
    const { user, checkingAuth } = useAuth();

    if (checkingAuth) return <div>Loading...</div>;

    return user ? <Navigate to="/dashboard" replace /> : children;
};

export default PublicRoute;
