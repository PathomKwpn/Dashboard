import { NavLink } from "react-router-dom";
import { LayoutDashboard, AlertTriangle } from "lucide-react";

const menus = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Events", to: "/events", icon: AlertTriangle },
];

const SideBar = () => {
  return (
    <aside className="w-64 bg-background border-r min-h-screen">
      <div className="p-4 text-lg font-semibold">Incident Monitor</div>

      <nav className="px-2 space-y-1">
        {menus.map((m) => (
          <NavLink
            key={m.to}
            to={m.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm
              ${isActive ? "bg-accent text-accent-foreground" : "hover:bg-muted"}`
            }
          >
            <m.icon className="h-4 w-4" />
            {m.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default SideBar;
