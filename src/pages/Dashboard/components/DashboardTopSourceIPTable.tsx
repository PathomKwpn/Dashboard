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
import type { TopSourceIP } from "../dashboard.types";

interface Props {
  data: TopSourceIP[];
}

const DashboardTopSourceIPTable = ({ data }: Props) => {
  const max = Math.max(...data.map((d) => d.log_count), 1);

  return (
    <Card className="gap-0 py-0 border-border/40 shadow-sm">
      <CardHeader className="gap-0 px-5 pt-5 pb-3">
        <CardTitle className="text-sm font-semibold">Top Source IPs</CardTitle>
        <CardDescription className="text-xs mt-0.5">
          Highest log volume sources
        </CardDescription>
        <CardAction>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="px-0 pb-2">
        <div className="divide-y divide-border/20">
          {data.slice(0, 8).map((row) => {
            const pct = Math.round((row.log_count / max) * 100);
            return (
              <div
                key={row.source_ip}
                className="flex items-center gap-3 px-5 py-2.5 hover:bg-muted/30 transition-colors"
              >
                <span className="w-4 text-xs text-muted-foreground shrink-0 text-center tabular-nums font-medium">
                  {row.rank}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-mono text-xs text-foreground truncate">
                      {row.source_ip}
                    </span>
                    <span className="text-[11px] text-muted-foreground ml-2 shrink-0 tabular-nums">
                      {row.log_count.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-[10px] text-muted-foreground mb-1.5">
                    {row.country}
                  </div>
                  <div className="h-1 w-full rounded-full bg-border/40 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary/50"
                      style={{ width: `${pct}%` }}
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

export default DashboardTopSourceIPTable;
