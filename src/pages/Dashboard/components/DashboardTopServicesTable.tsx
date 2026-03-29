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
import type { TopService } from "../dashboard.types";

interface Props {
  data: TopService[];
}

const DashboardTopServicesTable = ({ data }: Props) => {
  const maxLogs = Math.max(...data.map((d) => d.log_count), 1);

  return (
    <Card className="gap-0 py-0 border border-border/50 shadow-xs">
      <CardHeader className="gap-0 px-5 pt-4 pb-3">
        <CardTitle className="text-sm">Top Services</CardTitle>
        <CardDescription className="text-xs mt-0.5">
          Services by log volume
        </CardDescription>
        <CardAction>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground/30 hover:text-foreground"
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="px-0 pb-2">
        <div className="divide-y divide-border/20">
          {data.slice(0, 8).map((row) => {
            const barPct = Math.round((row.log_count / maxLogs) * 100);
            return (
              <div
                key={row.service}
                className="flex items-center gap-2.5 px-5 py-2 hover:bg-muted/20 transition-colors"
              >
                {/* Rank */}
                <span className="w-4 text-xs text-muted-foreground/40 shrink-0 text-center tabular-nums font-medium">
                  {row.rank}
                </span>

                {/* Service + bar */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs text-foreground truncate">
                      {row.service}
                    </span>
                    <span className="text-[10px] text-muted-foreground/50 ml-2 shrink-0 tabular-nums">
                      {row.log_count.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-[10px] text-muted-foreground/60 mb-1.5">
                    {row.error_rate.toFixed(1)}% error · {row.error_count.toLocaleString()} err
                  </div>
                  <div className="h-0.5 w-full rounded-full bg-border/50 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary/60"
                      style={{ width: `${barPct}%` }}
                    />
                  </div>
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
