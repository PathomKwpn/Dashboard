import Sidebar from "@/layouts/Sidebar";
import Header from "@/layouts/Header";
import { Outlet } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import { useState } from "react";

const MainLayout = () => {
  useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        collapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed((prev) => !prev)}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <Header />
        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-muted/40">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
