import { ArrowUpRight } from "lucide-react";
import {
  Card,
  CardAction,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ServiceStatus, TopService } from "../dashboard.types";

interface Props {
  data: TopService[];
}

const statusDot: Record<ServiceStatus, string> = {
  healthy: "bg-emerald-500",
  warning: "bg-yellow-500",
  critical: "bg-red-500",
};

const statusBar: Record<ServiceStatus, string> = {
  healthy: "bg-emerald-500",
  warning: "bg-orange-400",
  critical: "bg-red-500",
};

const DashboardTopServicesTable = ({ data }: Props) => {
  const maxLogs = Math.max(...data.map((d) => d.log_count), 1);

  return (
    <Card className="gap-0 py-0 border-none">
      <CardHeader className="gap-0 px-5 pt-5 pb-4">
        <CardTitle className="text-sm">Top Services</CardTitle>
        <CardDescription className="text-xs mt-0.5">
          Log volume and error metrics
        </CardDescription>
        <CardAction>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground/40 hover:text-foreground"
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="px-0 pb-2">
        <div className="divide-y divide-border/30">
          {data.map((row) => {
            const barPct = Math.round((row.log_count / maxLogs) * 100);
            return (
              <div
                key={row.service}
                className="flex items-center gap-3 px-5 py-3 hover:bg-muted/30 transition-colors"
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
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full  ${statusBar[row.status] ?? "bg-foreground/15"}`}
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
                  <span className="text-[10px] text-muted-foreground">
                    error
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardTopServicesTable;
