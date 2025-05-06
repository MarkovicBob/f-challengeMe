import { Navigate } from "react-router-dom";

const ProtectedLayout = ({ children }) => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  if (!token || !userId) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedLayout;
