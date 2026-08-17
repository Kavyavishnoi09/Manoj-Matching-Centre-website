import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-maroon-950"><div className="text-cream-100 animate-pulse">Loading...</div></div>;
  if (!user || !isAdmin) return <Navigate to="/admin/login" state={{ from: location }} replace />;

  return <Outlet />;
}
