import { useAuth } from "@/hooks/useAuth";
import { NAV_CONFIG } from "./sidebar/nav.config";
import SidebarBrand from "./sidebar/SidebarBrand";
import SidebarSection from "./sidebar/SidebarSection";

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const { user } = useAuth();
  // const navigate = useNavigate();

  // const handleLogout = async () => {
  //   await logout();
  //   navigate("/login");
  // };

  return (
    <aside
      className={`bg-sidebar border-r border-sidebar-border min-h-screen flex flex-col transition-all duration-200 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      <SidebarBrand collapsed={collapsed} onToggle={onToggle} />

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {NAV_CONFIG.map((section) => (
          <SidebarSection
            key={section.label}
            section={section}
            collapsed={collapsed}
            userRole={user?.role}
          />
        ))}
      </nav>
      {/* 
      <SidebarFooter
        user={user ?? null}
        collapsed={collapsed}
        isLoading={isLoading}
        onLogout={handleLogout}
      /> */}
    </aside>
  );
};

export default Sidebar;
