import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ component: children, ...props }) => {
  return props.loggedIn ? children : <Navigate to="/signin" />;
};

export default ProtectedRoute;
