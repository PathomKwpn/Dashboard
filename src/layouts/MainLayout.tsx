import Sidebar from "@/layouts/Sidebar";
import Header from "@/layouts/Header";
import { Outlet } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";

const MainLayout = () => {
  useTheme();

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-muted/40">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
