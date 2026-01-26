import Sidebar from "@/components/layout/SideBar";
import Header from "@/components/layout/Hearder";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 bg-muted/40 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
