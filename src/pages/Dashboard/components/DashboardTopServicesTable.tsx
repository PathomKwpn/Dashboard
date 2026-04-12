import { ArrowUpRight } from "lucide-react";
import {
  Card, CardAction, CardHeader, CardTitle, CardDescription, CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { TopService, ServiceStatus } from "../dashboard.types";

interface Props {
  data: TopService[];
}

/* ─── Status config ───────────────────────────────────────────────────── */
const STATUS: Record<ServiceStatus, { dot: string; label: string; text: string }> = {
  healthy:  { dot: "bg-emerald-500", label: "Healthy",  text: "text-emerald-500 dark:text-emerald-400" },
  warning:  { dot: "bg-amber-500",   label: "Warning",  text: "text-amber-500 dark:text-amber-400"     },
  critical: { dot: "bg-red-500",     label: "Critical", text: "text-red-500 dark:text-red-400"         },
};

const errorColor = (rate: number) => {
  if (rate >= 10) return "text-red-500 dark:text-red-400";
  if (rate >= 5)  return "text-amber-500 dark:text-amber-400";
  return "text-muted-foreground/50";
};

const barColor = (status: ServiceStatus) => {
  if (status === "critical") return "bg-red-500/60";
  if (status === "warning")  return "bg-amber-500/60";
  return "bg-primary/50";
};

/* ─── Component ───────────────────────────────────────────────────────── */
const DashboardTopServicesTable = ({ data }: Props) => {
  const maxLogs = Math.max(...data.map((d) => d.log_count), 1);

  return (
    <Card className="gap-0 py-0 border-border shadow-none">
      <CardHeader className="gap-0 px-5 pt-4 pb-3 border-b border-border/30">
        <CardTitle className="text-[13px] font-590 leading-none">Top Services</CardTitle>
        <CardDescription className="text-[11px] mt-1 text-muted-foreground/60">
          Services ranked by log volume
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
          <span className="flex-1 text-[10px] font-510 text-muted-foreground/40 uppercase tracking-wider">Service</span>
          <span className="text-[10px] font-510 text-muted-foreground/40 uppercase tracking-wider w-16 text-right">Error</span>
          <span className="text-[10px] font-510 text-muted-foreground/40 uppercase tracking-wider w-16 text-right">Logs</span>
        </div>

        {/* Rows */}
        {data.map((row) => {
          const barPct = Math.round((row.log_count / maxLogs) * 100);
          const st     = STATUS[row.status] ?? STATUS.healthy;

          return (
            <div
              key={row.service}
              className="flex items-center gap-3 px-5 py-3 border-b border-border/20
                         hover:bg-accent/50 transition-colors last:border-0"
            >
              {/* Rank */}
              <span className="w-5 shrink-0 text-center text-[11px] tabular-nums font-510 text-muted-foreground/30">
                {row.rank}
              </span>

              {/* Service info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[12px] font-510 text-foreground/85 truncate leading-none">
                    {row.service}
                  </span>
                  <span className={`flex items-center gap-1 text-[10px] font-510 shrink-0 ${st.text}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
                    {st.label}
                  </span>
                </div>
                <div className="h-px w-full rounded-full bg-border/30 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barColor(row.status)}`}
                    style={{ width: `${barPct}%` }}
                  />
                </div>
              </div>

              {/* Error rate */}
              <span className={`w-16 text-right text-[11px] font-510 tabular-nums shrink-0 ${errorColor(row.error_rate)}`}>
                {row.error_rate.toFixed(1)}%
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

export default DashboardTopServicesTable;
