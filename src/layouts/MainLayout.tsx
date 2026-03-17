import { Outlet } from 'react-router-dom';

/**
 * 主工作台布局
 * 左侧侧边栏 + 右侧内容区
 */
export function MainLayout() {
  return (
    <div className="flex h-screen">
      {/* 左侧侧边栏 */}
      <aside className="w-64 bg-card border-r border-border">
        <div className="p-6">
          <h2 className="text-lg font-semibold">任务清单</h2>
        </div>
      </aside>

      {/* 右侧主内容区 */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
