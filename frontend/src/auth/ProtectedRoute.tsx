import { Navigate } from 'react-router-dom';
import { getSessionUser, isAdminRole, isAuthenticated } from './session';

type ProtectedRouteProps = {
  children: React.ReactNode;
  roles?: string[];
  adminOnly?: boolean;
};

export default function ProtectedRoute({ children, roles, adminOnly }: ProtectedRouteProps) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const user = getSessionUser();
  if (adminOnly && !isAdminRole(user?.rol)) {
    return <Navigate to="/" replace />;
  }
  if (roles && roles.length > 0 && (!user?.rol || !roles.includes(user.rol))) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
