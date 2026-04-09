import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function AdminRoute() {
  const { user } = useAuth();
  return user?.isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
}
