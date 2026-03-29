import moment from "moment";
import { Shield, ShieldAlert, ShieldOff, Eye } from "lucide-react";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import type { SuspiciousIP, RiskLevel, IPStatus, AttackType } from "../geoDetection.types";

interface Props {
  data:    SuspiciousIP[];
  loading: boolean;
}

/* ─── Config ──────────────────────────────────────────────────────────── */
const RISK_STYLE: Record<RiskLevel, { badge: string; dot: string }> = {
  critical: { badge: "bg-red-500/10 text-red-400 border-red-500/20",       dot: "bg-red-500"    },
  high:     { badge: "bg-orange-500/10 text-orange-400 border-orange-500/20", dot: "bg-orange-500" },
  medium:   { badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",  dot: "bg-amber-400"  },
  low:      { badge: "bg-slate-500/10 text-slate-400 border-slate-500/20",  dot: "bg-slate-400"  },
};

const STATUS_CONFIG: Record<IPStatus, { icon: React.ReactNode; label: string; cls: string }> = {
  blocked:     { icon: <ShieldOff className="h-3 w-3" />,   label: "Blocked",     cls: "bg-red-500/10 text-red-400 border-red-500/20"       },
  monitoring:  { icon: <Eye className="h-3 w-3" />,         label: "Monitoring",  cls: "bg-sky-500/10 text-sky-400 border-sky-500/20"       },
  whitelisted: { icon: <Shield className="h-3 w-3" />,      label: "Whitelisted", cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
};

const ATTACK_LABEL: Record<AttackType, string> = {
  brute_force:          "Brute Force",
  ddos:                 "DDoS",
  sql_injection:        "SQLi",
  port_scan:            "Port Scan",
  credential_stuffing:  "Cred Stuff",
  anomaly:              "Anomaly",
  xss:                  "XSS",
};

/* ─── Component ───────────────────────────────────────────────────────── */
const SuspiciousIPTable = ({ data, loading }: Props) => {
  const blockedCount    = data.filter((d) => d.status === "blocked").length;
  const monitoringCount = data.filter((d) => d.status === "monitoring").length;

  return (
    <Card className="border border-border/50 shadow-xs gap-0 py-0">
      <CardHeader className="gap-0 px-5 pt-5 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <CardTitle className="text-sm flex items-center gap-2">
              <ShieldAlert className="h-3.5 w-3.5 text-orange-400/70 shrink-0" />
              Suspicious IPs
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Top threat actors ranked by attack volume
            </CardDescription>
          </div>
          <div className="flex items-center gap-3 shrink-0 text-[11px] text-muted-foreground/60">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500/70" />
              {blockedCount} blocked
            </span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-500/70" />
              {monitoringCount} monitoring
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-0 pb-0">
        {loading ? (
          <div className="px-5 pb-4 space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 rounded-lg" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-y border-border/30 bg-muted/20">
                {["#", "IP Address", "Country", "Attack Type", "Threat", "Attacks", "Last Seen", "Status"].map((h, i) => (
                  <TableHead
                    key={h}
                    className={`text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40 px-4 h-9 ${i === 5 ? "text-right" : ""} ${i === 0 ? "w-10" : ""}`}
                  >
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-sm text-muted-foreground/50">
                    No suspicious IPs detected
                  </TableCell>
                </TableRow>
              ) : (
                data.map((ip) => {
                  const risk   = RISK_STYLE[ip.threat_level];
                  const status = STATUS_CONFIG[ip.status];
                  return (
                    <TableRow key={ip.source_ip} className="border-border/20 hover:bg-muted/20 transition-colors">
                      <TableCell className="px-4 py-2.5 text-xs text-muted-foreground/40 tabular-nums font-mono w-10">
                        {ip.rank}
                      </TableCell>
                      <TableCell className="px-4 py-2.5 font-mono text-xs text-foreground/80 whitespace-nowrap">
                        {ip.source_ip}
                      </TableCell>
                      <TableCell className="px-4 py-2.5 text-xs text-foreground/70 whitespace-nowrap">
                        <span className="flex items-center gap-1.5">
                          <span className="text-[11px]">
                            {ip.country_code === "RU" ? "🇷🇺" :
                             ip.country_code === "CN" ? "🇨🇳" :
                             ip.country_code === "UA" ? "🇺🇦" :
                             ip.country_code === "NL" ? "🇳🇱" :
                             ip.country_code === "NG" ? "🇳🇬" :
                             ip.country_code === "VN" ? "🇻🇳" :
                             ip.country_code === "US" ? "🇺🇸" :
                             ip.country_code === "FR" ? "🇫🇷" :
                             ip.country_code === "DE" ? "🇩🇪" :
                             ip.country_code === "JP" ? "🇯🇵" :
                             ip.country_code === "SG" ? "🇸🇬" : "🌐"}
                          </span>
                          {ip.country}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-2.5 text-xs text-muted-foreground/70 whitespace-nowrap">
                        {ATTACK_LABEL[ip.attack_type] ?? ip.attack_type}
                      </TableCell>
                      <TableCell className="px-4 py-2.5">
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-medium capitalize rounded-md px-1.5 py-0.5 ${risk.badge}`}
                        >
                          <span className={`mr-1 h-1.5 w-1.5 rounded-full inline-block ${risk.dot}`} />
                          {ip.threat_level}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-2.5 text-right">
                        <span className="font-mono text-xs font-semibold tabular-nums text-foreground/85">
                          {ip.attack_count.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-2.5 text-xs text-muted-foreground/60 whitespace-nowrap tabular-nums">
                        {moment(ip.last_seen).fromNow()}
                      </TableCell>
                      <TableCell className="px-4 py-2.5">
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-medium rounded-md px-1.5 py-0.5 flex items-center gap-1 w-fit ${status.cls}`}
                        >
                          {status.icon}
                          {status.label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default SuspiciousIPTable;
