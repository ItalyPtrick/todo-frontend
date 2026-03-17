import { Outlet } from 'react-router-dom';

/**
 * 登录/注册页面的全屏居中布局
 */
export function AuthLayout() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Outlet />
    </div>
  );
}
