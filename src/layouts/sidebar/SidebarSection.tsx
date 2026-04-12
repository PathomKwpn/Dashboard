import SidebarMenuItem from "./SidebarMenuItem";
import type { NavSection, UserRole } from "./nav.config";

interface Props {
  section: NavSection;
  collapsed: boolean;
  userRole?: string;
}

const SidebarSection = ({ section, collapsed, userRole }: Props) => {
  const visibleItems = section.items.filter(
    (item) => !item.roles || (userRole && item.roles.includes(userRole as UserRole)),
  );

  if (visibleItems.length === 0) return null;

  return (
    <div>
      {!collapsed && (
        <h3 className="mb-2 px-3 text-[11px] font-medium tracking-wide text-muted-foreground/50 select-none">
          {section.label}
        </h3>
      )}
      <div className="space-y-0.5">
        {visibleItems.map((item) => (
          <SidebarMenuItem key={item.to} item={item} collapsed={collapsed} />
        ))}
      </div>
    </div>
  );
};

export default SidebarSection;
