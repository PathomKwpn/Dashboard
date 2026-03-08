import type { RiskLevel, TopSourceIP } from "../dashboard.types";

interface Props {
  data: TopSourceIP[];
}

const threatLabel: Record<RiskLevel, { color: string; text: string }> = {
  critical: { color: "bg-red-500", text: "text-red-600 dark:text-red-400" },
  high: {
    color: "bg-orange-500",
    text: "text-orange-600 dark:text-orange-400",
  },
  medium: {
    color: "bg-yellow-500",
    text: "text-yellow-600 dark:text-yellow-400",
  },
  low: { color: "bg-muted-foreground/40", text: "text-muted-foreground" },
};

const DashboardTopSourceIPTable = ({ data }: Props) => {
  const max = Math.max(...data.map((d) => d.log_count), 1);

  return (
    <div className="bg-card rounded-lg border border-border/50">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/40">
        <h3 className="text-sm font-semibold text-foreground">
          Top Source IPs
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Highest log-generating addresses
        </p>
      </div>

      {/* Rows */}
      <div className="divide-y divide-border/30">
        {data.map((row) => {
          const pct = Math.round((row.log_count / max) * 100);
          const t = threatLabel[row.threat_level] ?? threatLabel.low;
          return (
            <div
              key={row.source_ip}
              className="flex items-center gap-3 px-5 py-3 hover:bg-muted/20 transition-colors"
            >
              <span className="w-5 text-xs text-muted-foreground shrink-0 text-center tabular-nums">
                {row.rank}
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-medium text-foreground">
                    {row.source_ip}
                  </span>
                  <span className="text-[11px] text-muted-foreground ml-2 shrink-0 tabular-nums">
                    {row.log_count.toLocaleString()}
                  </span>
                </div>
                <div className="h-1 w-full rounded-full bg-muted/60 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-foreground/15 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              <span
                className={`text-[11px] font-medium capitalize shrink-0 ${t.text}`}
              >
                {row.threat_level}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardTopSourceIPTable;
