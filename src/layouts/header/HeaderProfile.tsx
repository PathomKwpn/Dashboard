import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { ROLE_LABELS } from "../sidebar/nav.config";

interface User {
  name: string;
  role: string;
}

interface Props {
  user: User | null;
  onLogout: () => void;
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");

const HeaderProfile = ({ user, onLogout }: Props) => (
  <>
    {user && (
      <button className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-accent transition-colors duration-150">
        <Avatar size="sm">
          <AvatarFallback className="text-[10px] font-semibold bg-primary/8 text-primary">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start leading-none">
          <span className="text-xs font-medium text-foreground">{user.name}</span>
          <span className="text-[10px] text-muted-foreground mt-0.5">
            {ROLE_LABELS[user.role] ?? user.role}
          </span>
        </div>
      </button>
    )}

    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onLogout}
          className="text-muted-foreground hover:text-destructive ml-0.5"
        >
          <LogOut className="h-3.5 w-3.5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Sign out</TooltipContent>
    </Tooltip>
  </>
);

export default HeaderProfile;
