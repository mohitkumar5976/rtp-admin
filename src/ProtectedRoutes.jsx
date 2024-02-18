import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const loggedIn = localStorage.getItem("user");
  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
};
