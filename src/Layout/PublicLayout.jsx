import { Navigate } from "react-router-dom";

const PublicLayout = ({ children }) => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  if (token && userId) {
    return <Navigate to="/start/home" replace />;
  }

  return children;
};

export default PublicLayout;
