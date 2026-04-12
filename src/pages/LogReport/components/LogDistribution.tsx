import { useEffect, useState } from "react";
import { Layers } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import PieChart from "@/components/charts/PieChart";
import BarChart from "@/components/charts/BarChart";
import { fetchLogDistribution } from "../logReport.mock";
import type { LogDistributionData } from "../logReport.types";

const LogDistribution = () => {
  const [data, setData]       = useState<LogDistributionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogDistribution().then((d) => { setData(d); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-72 rounded-xl" />
          <Skeleton className="h-72 rounded-xl" />
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-4">
      {/* Total banner */}
      <Card className="border-border shadow-none gap-0 py-0">
        <CardContent className="px-5 py-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <p className="text-2xl font-590 tracking-tight text-foreground">
              {data.total_logs >= 1_000_000
                ? `${(data.total_logs / 1_000_000).toFixed(2)}M`
                : data.total_logs.toLocaleString()}
            </p>
            <p className="text-[11px] text-muted-foreground/60 mt-0.5">Total log entries in the last 24 hours</p>
          </div>
        </CardContent>
      </Card>

      {/* Pie + legend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-border shadow-none gap-0 py-0">
          <CardHeader className="px-5 pt-4 pb-3 border-b border-border/30 gap-0">
            <CardTitle className="text-[13px] font-590 leading-none">By Severity</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <PieChart
              data={data.by_severity.map((s) => ({ name: s.name, value: s.value, itemStyle: { color: s.color } }))}
              centerLabel="Total"
              height="220px"
            />
          </CardContent>
        </Card>

        <Card className="border-border shadow-none gap-0 py-0">
          <CardHeader className="px-5 pt-4 pb-3 border-b border-border/30 gap-0">
            <CardTitle className="text-[13px] font-590 leading-none">Severity Detail</CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            {data.by_severity.map((s) => {
              const pct = Math.round((s.value / data.total_logs) * 100);
              return (
                <div key={s.name} className="flex items-center gap-3 px-5 py-3 border-b border-border/20 last:border-0">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                  <span className="flex-1 text-[12px] text-foreground/80">{s.name}</span>
                  <div className="w-24 h-1 rounded-full bg-border/30 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: s.color + "99" }} />
                  </div>
                  <span className="w-14 text-right text-[11px] tabular-nums text-muted-foreground/60">
                    {s.value >= 1_000_000 ? `${(s.value / 1_000_000).toFixed(1)}M` : s.value >= 1000 ? `${(s.value / 1000).toFixed(0)}k` : s.value}
                  </span>
                  <span className="w-8 text-right text-[11px] tabular-nums text-muted-foreground/40">{pct}%</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* By service stacked bar */}
      <Card className="border-border shadow-none gap-0 py-0">
        <CardHeader className="px-5 pt-4 pb-3 border-b border-border/30 gap-0">
          <CardTitle className="text-[13px] font-590 leading-none">Volume by Service</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <BarChart
            xAxisData={data.by_service.map((s) => s.service.replace("-service", ""))}
            seriesData={[
              { name: "Info",     data: data.by_service.map((s) => s.info),     color: "#38bdf8" },
              { name: "Debug",    data: data.by_service.map((s) => s.debug),    color: "#94a3b8" },
              { name: "Warning",  data: data.by_service.map((s) => s.warning),  color: "#f59e0b" },
              { name: "Error",    data: data.by_service.map((s) => s.error),    color: "#f97316" },
              { name: "Critical", data: data.by_service.map((s) => s.critical), color: "#ef4444" },
            ]}
            height="220px"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default LogDistribution;
