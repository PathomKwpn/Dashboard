import { ArrowUpRight } from "lucide-react";
import {
  Card, CardAction, CardHeader, CardTitle, CardDescription, CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { TopSourceIP, RiskLevel } from "../dashboard.types";

interface Props {
  data: TopSourceIP[];
}

/* ─── Threat config ───────────────────────────────────────────────────── */
const THREAT: Record<RiskLevel, { dot: string; label: string; text: string; bar: string }> = {
  critical: { dot: "bg-red-500",    label: "Critical", text: "text-red-500 dark:text-red-400",       bar: "bg-red-500/60"    },
  high:     { dot: "bg-orange-500", label: "High",     text: "text-orange-500 dark:text-orange-400", bar: "bg-orange-500/60" },
  medium:   { dot: "bg-amber-500",  label: "Medium",   text: "text-amber-500 dark:text-amber-400",   bar: "bg-amber-500/60"  },
  low:      { dot: "bg-slate-400",  label: "Low",      text: "text-muted-foreground/50",             bar: "bg-primary/40"    },
};

/* ─── Component ───────────────────────────────────────────────────────── */
const DashboardTopSourceIPTable = ({ data }: Props) => {
  const max = Math.max(...data.map((d) => d.log_count), 1);

  return (
    <Card className="gap-0 py-0 border-border shadow-none">
      <CardHeader className="gap-0 px-5 pt-4 pb-3 border-b border-border/30">
        <CardTitle className="text-[13px] font-590 leading-none">Top Source IPs</CardTitle>
        <CardDescription className="text-[11px] mt-1 text-muted-foreground/60">
          Highest volume attack origins
        </CardDescription>
        <CardAction>
          <Button variant="ghost" size="icon-sm" className="text-muted-foreground/40 hover:text-foreground">
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="px-0 pb-0">
        {/* Column labels */}
        <div className="flex items-center gap-3 px-5 py-2 border-b border-border/30 bg-background">
          <span className="w-5 shrink-0" />
          <span className="flex-1 text-[10px] font-510 text-muted-foreground/40 uppercase tracking-wider">IP Address</span>
          <span className="text-[10px] font-510 text-muted-foreground/40 uppercase tracking-wider w-20 text-right">Threat</span>
          <span className="text-[10px] font-510 text-muted-foreground/40 uppercase tracking-wider w-16 text-right">Logs</span>
        </div>

        {/* Rows */}
        {data.map((row) => {
          const pct    = Math.round((row.log_count / max) * 100);
          const threat = THREAT[row.threat_level] ?? THREAT.low;

          return (
            <div
              key={row.source_ip}
              className="flex items-center gap-3 px-5 py-3 border-b border-border/20
                         hover:bg-accent/50 transition-colors last:border-0"
            >
              {/* Rank */}
              <span className="w-5 shrink-0 text-center text-[11px] tabular-nums font-510 text-muted-foreground/30">
                {row.rank}
              </span>

              {/* IP + country */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-mono text-[12px] text-foreground/85 truncate leading-none">
                    {row.source_ip}
                  </span>
                  <span className="text-[10px] text-muted-foreground/45 font-510 shrink-0 whitespace-nowrap">
                    {row.country}
                  </span>
                </div>
                <div className="h-px w-full rounded-full bg-border/30 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${threat.bar}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              {/* Threat level */}
              <span className={`w-20 text-right flex items-center justify-end gap-1 text-[10px] font-510 shrink-0 ${threat.text}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${threat.dot} shrink-0`} />
                {threat.label}
              </span>

              {/* Log count */}
              <span className="w-16 text-right text-[12px] font-510 tabular-nums text-foreground/70 shrink-0">
                {row.log_count >= 1000
                  ? `${(row.log_count / 1000).toFixed(1)}k`
                  : row.log_count.toLocaleString()}
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default DashboardTopSourceIPTable;
