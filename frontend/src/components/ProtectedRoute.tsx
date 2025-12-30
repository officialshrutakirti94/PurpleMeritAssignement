import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token, authLoading } = useAuth();

  // ⏳ Wait until auth check is complete
  if (authLoading) {
    return <LoadingSpinner />;
  }

  // 🔒 No token → login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Authenticated
  return <>{children}</>;
}
