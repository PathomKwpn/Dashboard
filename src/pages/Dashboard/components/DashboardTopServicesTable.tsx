import type { ServiceStatus, TopService } from "../dashboard.types";

interface Props {
  data: TopService[];
}

const statusDot: Record<ServiceStatus, string> = {
  healthy: "bg-emerald-500",
  warning: "bg-yellow-500",
  critical: "bg-red-500",
};

const DashboardTopServicesTable = ({ data }: Props) => {
  const maxLogs = Math.max(...data.map((d) => d.log_count), 1);

  return (
    <div className="bg-card rounded-lg border border-border/50">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/40">
        <h3 className="text-sm font-semibold text-foreground">Top Services</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Log volume and error metrics
        </p>
      </div>

      {/* Rows */}
      <div className="divide-y divide-border/30">
        {data.map((row) => {
          const barPct = Math.round((row.log_count / maxLogs) * 100);
          return (
            <div
              key={row.service}
              className="flex items-center gap-3 px-5 py-3 hover:bg-muted/20 transition-colors"
            >
              {/* Status dot */}
              <span
                className={`h-1.5 w-1.5 rounded-full shrink-0 ${statusDot[row.status] ?? statusDot.healthy}`}
              />

              {/* Service + bar */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-medium text-foreground truncate">
                    {row.service}
                  </span>
                  <span className="text-[11px] text-muted-foreground ml-2 shrink-0 tabular-nums">
                    {row.log_count.toLocaleString()}
                  </span>
                </div>
                <div className="h-1 w-full rounded-full bg-muted/60 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-foreground/15 transition-all"
                    style={{ width: `${barPct}%` }}
                  />
                </div>
              </div>

              {/* Error rate */}
              <div className="flex flex-col items-end shrink-0">
                <span
                  className={`text-xs font-semibold tabular-nums ${
                    row.error_rate > 5
                      ? "text-red-600 dark:text-red-400"
                      : row.error_rate > 2
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-muted-foreground"
                  }`}
                >
                  {row.error_rate.toFixed(2)}%
                </span>
                <span className="text-[10px] text-muted-foreground">error</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardTopServicesTable;
