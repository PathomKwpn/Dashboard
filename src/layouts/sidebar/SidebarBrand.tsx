import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  collapsed: boolean;
  onToggle: () => void;
}

const SidebarBrand = ({ collapsed, onToggle }: Props) => (
  <div className="flex items-center justify-between border-b border-sidebar-border h-14 px-4">
    <div className="flex items-center gap-2.5 min-w-0">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold text-sm shrink-0 select-none">
        P
      </div>
      {!collapsed && (
        <div className="min-w-0">
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Pathom
          </span>
          <span className="block text-[10px] text-muted-foreground font-normal leading-none mt-0.5">
            Dashboard
          </span>
        </div>
      )}
    </div>

    <Button
      variant="ghost"
      size="icon-sm"
      onClick={onToggle}
      className="text-muted-foreground hover:text-foreground shrink-0"
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      {collapsed ? (
        <ChevronsRight className="h-3.5 w-3.5" />
      ) : (
        <ChevronsLeft className="h-3.5 w-3.5" />
      )}
    </Button>
  </div>
);

export default SidebarBrand;
