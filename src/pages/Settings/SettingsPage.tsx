import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ROLE_LABELS } from "@/layouts/sidebar/nav.config";
import { Sun, Moon, Bell, User, Shield, Database } from "lucide-react";

/* ─── Toggle switch ─────────────────────────────────────────────────────── */
const Toggle = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <button
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent
      transition-colors duration-200 focus:outline-none
      ${checked ? "bg-primary" : "bg-muted"}`}
  >
    <span
      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm
        transition-transform duration-200 ${checked ? "translate-x-4" : "translate-x-0"}`}
    />
  </button>
);

/* ─── Page ───────────────────────────────────────────────────────────────── */
const SettingsPage = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [displayName, setDisplayName] = useState(user?.name ?? "");
  const [notifyAlerts,  setNotifyAlerts]  = useState(true);
  const [notifyReports, setNotifyReports] = useState(false);
  const [notifySystem,  setNotifySystem]  = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-full bg-background">
      <div className="border-b border-border/40">
        <div className="max-w-3xl mx-auto px-6 py-5">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your account preferences and system configuration
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-6 space-y-4">
        {/* ── Profile ── */}
        <Card className="gap-0 py-0 border-border/40 shadow-sm">
          <CardHeader className="gap-0 px-5 pt-5 pb-3 border-b border-border/30">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-[13px] font-590">Profile</CardTitle>
            </div>
            <CardDescription className="text-[11px] mt-0.5 ml-6">
              Your account information
            </CardDescription>
          </CardHeader>

          <CardContent className="px-5 py-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-muted-foreground">
                  Display Name
                </label>
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="h-8 text-[12px]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-muted-foreground">
                  Role
                </label>
                <div className="h-8 px-3 flex items-center rounded-md border border-border/60 bg-muted/40">
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                    {ROLE_LABELS[user?.role ?? "user"] ?? user?.role}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-muted-foreground">Email</label>
              <Input
                value={user?.email ?? ""}
                readOnly
                className="h-8 text-[12px] bg-muted/40 text-muted-foreground"
              />
            </div>
          </CardContent>
        </Card>

        {/* ── Appearance ── */}
        <Card className="gap-0 py-0 border-border/40 shadow-sm">
          <CardHeader className="gap-0 px-5 pt-5 pb-3 border-b border-border/30">
            <div className="flex items-center gap-2">
              {theme === "dark" ? (
                <Moon className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Sun className="h-4 w-4 text-muted-foreground" />
              )}
              <CardTitle className="text-[13px] font-590">Appearance</CardTitle>
            </div>
            <CardDescription className="text-[11px] mt-0.5 ml-6">
              Customize the interface theme
            </CardDescription>
          </CardHeader>

          <CardContent className="px-5 py-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[12px] font-medium text-foreground">Dark Mode</p>
                <p className="text-[11px] text-muted-foreground/70 mt-0.5">
                  Currently using <span className="font-medium">{theme}</span> theme
                </p>
              </div>
              <Toggle checked={theme === "dark"} onChange={toggleTheme} />
            </div>
          </CardContent>
        </Card>

        {/* ── Notifications ── */}
        <Card className="gap-0 py-0 border-border/40 shadow-sm">
          <CardHeader className="gap-0 px-5 pt-5 pb-3 border-b border-border/30">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-[13px] font-590">Notifications</CardTitle>
            </div>
            <CardDescription className="text-[11px] mt-0.5 ml-6">
              Configure alert and report notifications
            </CardDescription>
          </CardHeader>

          <CardContent className="px-5 py-5 space-y-4">
            {[
              { label: "Security Alerts",  desc: "Critical and high-risk events",       value: notifyAlerts,   set: setNotifyAlerts   },
              { label: "Report Ready",     desc: "When a scheduled report is ready",    value: notifyReports,  set: setNotifyReports  },
              { label: "System Messages",  desc: "Maintenance and system updates",      value: notifySystem,   set: setNotifySystem   },
            ].map(({ label, desc, value, set }) => (
              <div key={label} className="flex items-center justify-between">
                <div>
                  <p className="text-[12px] font-medium text-foreground">{label}</p>
                  <p className="text-[11px] text-muted-foreground/70 mt-0.5">{desc}</p>
                </div>
                <Toggle checked={value} onChange={set} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ── Data & Storage ── */}
        <Card className="gap-0 py-0 border-border/40 shadow-sm">
          <CardHeader className="gap-0 px-5 pt-5 pb-3 border-b border-border/30">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-[13px] font-590">Data & Storage</CardTitle>
            </div>
            <CardDescription className="text-[11px] mt-0.5 ml-6">
              Log retention and data export settings
            </CardDescription>
          </CardHeader>

          <CardContent className="px-5 py-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-muted-foreground">
                Log Retention (days)
              </label>
              <Input
                defaultValue="90"
                className="h-8 text-[12px] w-32"
                type="number"
                min={1}
                max={365}
              />
            </div>
            <div className="pt-1">
              <Button variant="outline" size="sm" className="text-[12px]">
                <Shield className="h-3.5 w-3.5 mr-1.5" />
                Export My Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ── Save ── */}
        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" size="sm" className="text-[12px]">
            Reset to defaults
          </Button>
          <Button size="sm" className="text-[12px] min-w-20" onClick={handleSave}>
            {saved ? "Saved!" : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
