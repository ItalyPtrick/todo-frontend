import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../services/token-manager';

/**
 * 受保护的路由组件
 * 未认证用户重定向到登录页
 */
export function ProtectedRoute() {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
