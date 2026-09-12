import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const location = useLocation();

  // Temporary admin authentication check.
  // Later we will replace this with Supabase Auth.
  const isAuthenticated =
    localStorage.getItem("adminAuthenticated") === "true";

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/admin"
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
}