import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthProvider";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? children : <Navigate to="/401" />;
};

export default ProtectedRoute;
