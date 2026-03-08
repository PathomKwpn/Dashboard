import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { RiskLevel, TopSourceIP } from "../dashboard.types";

interface Props {
  data: TopSourceIP[];
}

const threatVariant: Record<RiskLevel, { cls: string }> = {
  critical: {
    cls: "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/15 dark:text-red-400 dark:border-red-800/30",
  },
  high: {
    cls: "bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/15 dark:text-orange-400 dark:border-orange-800/30",
  },
  medium: {
    cls: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/15 dark:text-yellow-400 dark:border-yellow-800/30",
  },
  low: { cls: "bg-muted text-muted-foreground border-border" },
};

const DashboardTopSourceIPTable = ({ data }: Props) => {
  const max = Math.max(...data.map((d) => d.log_count), 1);

  return (
    <Card className="gap-0 py-0">
      <CardHeader className="gap-0 px-5 pt-5 pb-4">
        <CardTitle className="text-sm">Top Source IPs</CardTitle>
        <CardDescription className="text-xs mt-0.5">
          Highest log-generating addresses
        </CardDescription>
      </CardHeader>

      <CardContent className="px-0 pb-2">
        <div className="divide-y divide-border/30">
          {data.map((row) => {
            const pct = Math.round((row.log_count / max) * 100);
            const t = threatVariant[row.threat_level] ?? threatVariant.low;
            return (
              <div
                key={row.source_ip}
                className="flex items-center gap-3 px-5 py-3 hover:bg-muted/30 transition-colors"
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
                  <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-foreground/15 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <Badge
                  variant="outline"
                  className={`text-[10px] capitalize rounded-md ${t.cls}`}
                >
                  {row.threat_level}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardTopSourceIPTable;
