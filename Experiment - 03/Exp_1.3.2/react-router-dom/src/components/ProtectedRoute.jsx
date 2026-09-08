import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles, user }) {
  if (!user) {
    // Not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles is provided and user's role is not included, go to unauthorized
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}