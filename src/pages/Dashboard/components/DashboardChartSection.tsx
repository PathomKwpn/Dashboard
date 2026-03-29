import { ArrowUpRight } from "lucide-react";
import { LineChart, PieChart } from "@/components/charts";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { EventTimeSeries, LogLevelItem } from "../dashboard.types";

const LEVEL_COLORS = ["#ef4444", "#f97316", "#f59e0b", "#22c55e", "#94a3b8"];

interface DashboardChartSectionProps {
  timeAxis: string[];
  timeSeries: EventTimeSeries[];
  logLevelDistribution: LogLevelItem[];
}

const DashboardChartSection = ({
  timeAxis,
  timeSeries,
  logLevelDistribution,
}: DashboardChartSectionProps) => {
  const totalLogs = logLevelDistribution.reduce((s, d) => s + d.value, 0);

  const peak    = timeSeries.length > 0 ? Math.max(...timeSeries.map((d) => d.events)) : null;
  const min     = timeSeries.length > 0 ? Math.min(...timeSeries.map((d) => d.events)) : null;
  const avg     = timeSeries.length > 0 ? Math.round(timeSeries.reduce((s, d) => s + d.events, 0) / timeSeries.length) : null;
  const avg24h  = timeSeries.length > 0 ? timeSeries[timeSeries.length - 1]?.avg_24h : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* ── Log Volume Trend ── */}
      <Card className="lg:col-span-2 gap-0 py-0 border-border/40 shadow-sm">
        <CardHeader className="gap-0 px-5 pt-5 pb-0">
          <CardTitle className="text-sm font-semibold">Log Volume Trend</CardTitle>
          <CardDescription className="text-xs mt-0.5">
            Events vs. 24-hour rolling average
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

        {/* Stats strip */}
        <div className="px-5 pt-4 pb-2 flex items-center gap-6 border-b border-border/30">
          {[
            { label: "Peak",    val: peak    },
            { label: "Min",     val: min     },
            { label: "Avg/hr",  val: avg     },
            { label: "24h Avg", val: avg24h  },
          ].map(({ label, val }) => (
            <div key={label}>
              <p className="text-[10px] font-medium text-muted-foreground">{label}</p>
              <p className="text-sm font-semibold tabular-nums mt-0.5">
                {val !== null ? val!.toLocaleString() : "\u2014"}
              </p>
            </div>
          ))}
          <div className="ml-auto text-right">
            <p className="text-[10px] font-medium text-muted-foreground">Points</p>
            <p className="text-sm font-semibold tabular-nums mt-0.5">{timeSeries.length}</p>
          </div>
        </div>

        <CardContent className="px-2 pb-3 pt-0">
          <LineChart
            xAxisData={timeAxis}
            seriesData={[
              {
                name: "Log Volume",
                data: timeSeries.map((d) => d.events),
                smooth: true,
                color: "#818cf8",
                areaColor: ["rgba(129,140,248,0.12)", "rgba(129,140,248,0.01)"],
              },
              {
                name: "24h Average",
                data: timeSeries.map((d) => d.avg_24h),
                smooth: true,
                color: "#94a3b8",
              },
            ]}
            height="260px"
          />
        </CardContent>
      </Card>

      {/* ── Log Level Distribution ── */}
      <Card className="gap-0 py-0 flex flex-col border-border/40 shadow-sm">
        <CardHeader className="gap-0 px-5 pt-5 pb-3">
          <CardTitle className="text-sm font-semibold">Log Level Distribution</CardTitle>
          <CardDescription className="text-xs mt-0.5">Breakdown by severity</CardDescription>
          <CardAction>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold tabular-nums text-muted-foreground">
                {totalLogs.toLocaleString()}
              </span>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardAction>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col justify-center px-2 pb-0">
          <PieChart
            data={logLevelDistribution.map((d, i) => ({
              ...d,
              itemStyle: { color: LEVEL_COLORS[i % LEVEL_COLORS.length] },
            }))}
            height="180px"
            centerLabel="Total"
          />
        </CardContent>

        {/* Legend */}
        <div className="px-5 pb-5 pt-2 space-y-2">
          {logLevelDistribution.map((d, i) => {
            const pct = totalLogs > 0 ? ((d.value / totalLogs) * 100).toFixed(1) : "0.0";
            return (
              <div key={d.name} className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-sm shrink-0"
                  style={{ background: LEVEL_COLORS[i % LEVEL_COLORS.length] }}
                />
                <span className="text-xs text-muted-foreground flex-1">{d.name}</span>
                <span className="text-xs font-medium tabular-nums">{pct}%</span>
                <span className="text-[11px] text-muted-foreground tabular-nums w-12 text-right">
                  {d.value.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default DashboardChartSection;
