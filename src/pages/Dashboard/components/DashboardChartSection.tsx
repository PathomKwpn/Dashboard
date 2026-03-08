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

// Muted, professional palette — only varies by lightness/saturation
const LEVEL_COLORS = ["#ef4444", "#f59e0b", "#6366f1", "#22c55e", "#94a3b8"];

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Log Volume Trend */}
      <Card className="lg:col-span-2 gap-0 py-0 border-none">
        <CardHeader className="gap-0 px-5 pt-5 pb-3">
          <CardTitle className="text-sm">Log Volume Trend</CardTitle>
          <CardDescription className="text-xs mt-0.5">
            Events compared with 24-hour rolling average
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
        <div className="px-5 pb-3 flex items-center gap-6 border-t border-border/40 pt-3">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Peak
            </p>
            <p className="text-sm font-semibold tabular-nums">
              {timeSeries.length > 0
                ? Math.max(...timeSeries.map((d) => d.events)).toLocaleString()
                : "—"}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Avg / hr
            </p>
            <p className="text-sm font-semibold tabular-nums">
              {timeSeries.length > 0
                ? Math.round(
                    timeSeries.reduce((s, d) => s + d.events, 0) /
                      timeSeries.length,
                  ).toLocaleString()
                : "—"}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Current Avg
            </p>
            <p className="text-sm font-semibold tabular-nums">
              {timeSeries.length > 0
                ? (timeSeries[
                    timeSeries.length - 1
                  ]?.avg_24h?.toLocaleString() ?? "—")
                : "—"}
            </p>
          </div>
        </div>
        <CardContent className="px-2 pb-3">
          <LineChart
            xAxisData={timeAxis}
            seriesData={[
              {
                name: "Log Volume",
                data: timeSeries.map((d) => d.events),
                smooth: true,
                color: "#6366f1",
                areaColor: ["rgba(99,102,241,0.18)", "rgba(99,102,241,0.02)"],
              },
              {
                name: "24h Average",
                data: timeSeries.map((d) => d.avg_24h),
                smooth: true,
                color: "#a5b4fc",
              },
            ]}
            height="280px"
          />
        </CardContent>
      </Card>

      {/* Log Level Distribution */}
      <Card className="gap-0 py-0 flex flex-col border-none">
        <CardHeader className="gap-0 px-5 pt-5 pb-3">
          <CardTitle className="text-sm">Log Level Distribution</CardTitle>
          <CardDescription className="text-xs mt-0.5">
            Breakdown by severity
          </CardDescription>
          <CardAction>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold tabular-nums">
                {totalLogs.toLocaleString()}
              </span>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground/40 hover:text-foreground"
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
            height="190px"
            centerLabel="Total"
          />
        </CardContent>

        {/* Legend */}
        <div className="px-5 pb-5 space-y-2">
          {logLevelDistribution.map((d, i) => {
            const pct =
              totalLogs > 0 ? ((d.value / totalLogs) * 100).toFixed(1) : "0.0";
            return (
              <div key={d.name} className="flex items-center gap-2.5">
                <span
                  className="h-2 w-2 rounded-sm shrink-0"
                  style={{ background: LEVEL_COLORS[i % LEVEL_COLORS.length] }}
                />
                <span className="text-xs text-muted-foreground flex-1">
                  {d.name}
                </span>
                <span className="text-xs font-medium tabular-nums text-foreground">
                  {pct}%
                </span>
                <span className="text-[10px] text-muted-foreground tabular-nums w-12 text-right">
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
