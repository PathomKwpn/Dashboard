import { LineChart } from "@/components/charts";
import type { EventTimeSeries } from "../dashboard.types";

interface DashboardChartSectionProps {
  timeAxis: string[];
  timeSeries: EventTimeSeries[];
}

const DashboardChartSection = ({
  timeAxis,
  timeSeries,
}: DashboardChartSectionProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-3 bg-card rounded-xl border border-border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">Event Volume Trend</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Event counts compared with 24h average
            </p>
          </div>
          <button className="text-sm text-primary hover:underline">
            View full report →
          </button>
        </div>
        <LineChart
          xAxisData={timeAxis}
          seriesData={[
            {
              name: "Events",
              data: timeSeries.map((d) => d.events),
              smooth: true,
            },
            {
              name: "24h average",
              data: timeSeries.map((d) => d.avg_24h),
              smooth: true,
            },
          ]}
          height="350px"
        />
      </div>
    </div>
  );
};

export default DashboardChartSection;
