import { useRef, useState, useEffect } from "react";
import moment from "moment";
import {
  Bell, ShieldAlert, AlertTriangle, Info, CheckCircle2,
  Check, RefreshCw, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNotifications } from "./useNotifications";
import type { NotificationType } from "./notification.types";

/* ─── Type config ────────────────────────────────────────────────────────── */
const TYPE_CONFIG: Record<
  NotificationType,
  { icon: React.ReactNode; bg: string; text: string }
> = {
  alert: {
    icon: <ShieldAlert className="h-3.5 w-3.5" />,
    bg: "bg-red-500/12",
    text: "text-red-400",
  },
  warning: {
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
    bg: "bg-amber-500/12",
    text: "text-amber-400",
  },
  info: {
    icon: <Info className="h-3.5 w-3.5" />,
    bg: "bg-sky-500/12",
    text: "text-sky-400",
  },
  success: {
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    bg: "bg-emerald-500/12",
    text: "text-emerald-400",
  },
};

/* ─── Notification panel ─────────────────────────────────────────────────── */
const NotificationPanel = () => {
  const { notifications, loading, unreadCount, markRead, markAllRead, refetch } =
    useNotifications();

  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  /* Close on outside click */
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  /* Close on Escape */
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <div ref={panelRef} className="relative">
      {/* ── Bell trigger ── */}
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => setOpen((v) => !v)}
        className="relative text-muted-foreground hover:text-foreground"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white ring-2 ring-background leading-none">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {/* ── Dropdown panel ── */}
      {open && (
        <div
          className="absolute right-0 top-[calc(100%+8px)] w-[360px] rounded-xl border border-border
                     bg-card shadow-xl shadow-black/20 z-50 flex flex-col overflow-hidden
                     animate-in fade-in-0 slide-in-from-top-2 duration-150"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-590 text-foreground">Notifications</span>
              {unreadCount > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary/15 px-1 text-[10px] font-510 text-primary">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-0.5">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={markAllRead}
                  className="text-muted-foreground/60 hover:text-foreground"
                  title="Mark all as read"
                >
                  <Check className="h-3.5 w-3.5" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={refetch}
                className="text-muted-foreground/60 hover:text-foreground"
                title="Refresh"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setOpen(false)}
                className="text-muted-foreground/60 hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* List */}
          <div className="overflow-y-auto max-h-[420px]">
            {loading ? (
              <div className="px-4 py-3 space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="h-7 w-7 rounded-lg shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3 w-3/4 rounded" />
                      <Skeleton className="h-2.5 w-full rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground/50">
                <Bell className="h-8 w-8 opacity-30" />
                <p className="text-[12px]">No notifications</p>
              </div>
            ) : (
              notifications.map((n) => {
                const cfg = TYPE_CONFIG[n.type];
                return (
                  <button
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left border-b border-border/30
                      last:border-0 transition-colors duration-100
                      ${n.read ? "hover:bg-accent/40" : "bg-primary/[0.03] hover:bg-primary/[0.06]"}`}
                  >
                    {/* Type icon */}
                    <div
                      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${cfg.bg} ${cfg.text}`}
                    >
                      {cfg.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={`text-[12px] font-510 leading-snug ${
                            n.read ? "text-foreground/70" : "text-foreground"
                          }`}
                        >
                          {n.title}
                        </span>
                        {!n.read && (
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground/60 leading-relaxed mt-0.5 line-clamp-2">
                        {n.description}
                      </p>
                      <p className="text-[10px] text-muted-foreground/40 mt-1 tabular-nums">
                        {moment(n.timestamp).fromNow()}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          {!loading && notifications.length > 0 && (
            <div className="px-4 py-2.5 border-t border-border/50 bg-background/40">
              <button className="w-full text-center text-[11px] text-primary/70 hover:text-primary transition-colors font-510">
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
