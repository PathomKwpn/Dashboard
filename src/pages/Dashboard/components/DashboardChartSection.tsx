import { LineChart, PieChart } from "@/components/charts";
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
      <div className="lg:col-span-2 bg-card rounded-lg border border-border/50">
        <div className="px-5 pt-5 pb-3">
          <h3 className="text-sm font-semibold text-foreground">
            Log Volume Trend
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Events compared with 24-hour rolling average
          </p>
        </div>
        <div className="px-2 pb-3">
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
        </div>
      </div>

      {/* Log Level Distribution */}
      <div className="bg-card rounded-lg border border-border/50 flex flex-col">
        <div className="px-5 pt-5 pb-3">
          <h3 className="text-sm font-semibold text-foreground">
            Log Level Distribution
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Breakdown by severity
          </p>
        </div>

        <div className="flex-1 flex flex-col justify-center px-2">
          <PieChart
            data={logLevelDistribution.map((d, i) => ({
              ...d,
              itemStyle: { color: LEVEL_COLORS[i % LEVEL_COLORS.length] },
            }))}
            height="190px"
            centerLabel="Total"
          />
        </div>

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
      </div>
    </div>
  );
};

export default DashboardChartSection;
