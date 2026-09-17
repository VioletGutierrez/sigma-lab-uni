// Responsable: Violet Fernanda Gutierrez Reyes - Frontend
import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function Layout({ children, breadcrumbs, showSearch = false, searchPlaceholder = 'Buscar...', onSearch }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="bg-background text-on-background font-body-md text-body-md min-h-screen">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ${
          isCollapsed ? 'ml-20' : 'ml-72'
        }`}
      >
        <Topbar
          breadcrumbs={breadcrumbs}
          showSearch={showSearch}
          searchPlaceholder={searchPlaceholder}
          onSearch={onSearch}
        />
        <main className="flex-1 p-lg overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}