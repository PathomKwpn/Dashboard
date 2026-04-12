import { useEffect, useState } from "react";
import { ShieldAlert, BarChart2, TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import LineChart from "@/components/charts/LineChart";
import { fetchErrorRate } from "../logAnalytics.mock";
import type { ErrorRateData } from "../logAnalytics.types";

const KPICard = ({
  label, value, sub, icon: Icon, iconCls,
}: {
  label: string; value: string; sub: string;
  icon: React.ElementType; iconCls: string;
}) => (
  <Card className="border-border shadow-none gap-0 py-0">
    <CardContent className="p-4">
      <div className="flex items-start justify-between mb-3">
        <span className="text-[11px] font-510 text-muted-foreground/60">{label}</span>
        <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${iconCls}`}>
          <Icon className="h-3.5 w-3.5" />
        </div>
      </div>
      <p className="text-2xl font-590 text-foreground tracking-tight">{value}</p>
      <p className="text-[11px] text-muted-foreground/60 mt-1">{sub}</p>
    </CardContent>
  </Card>
);

const ErrorRateChart = () => {
  const [data, setData]       = useState<ErrorRateData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchErrorRate().then((d) => { setData(d); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
        <Skeleton className="h-72 rounded-xl" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard
          label="Current Error Rate"
          value={`${data.current_rate}%`}
          sub={data.current_rate >= 10 ? "⚠ Above SLA threshold" : "Within SLA"}
          icon={ShieldAlert}
          iconCls={data.current_rate >= 10 ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400"}
        />
        <KPICard
          label="24h Average"
          value={`${data.avg_rate}%`}
          sub="rolling mean"
          icon={BarChart2}
          iconCls="bg-primary/10 text-primary"
        />
        <KPICard
          label="SLA Breaches"
          value={String(data.sla_breaches)}
          sub={`peak ${data.max_rate}% — SLA ≤ 10%`}
          icon={TrendingUp}
          iconCls={data.sla_breaches > 0 ? "bg-amber-500/10 text-amber-400" : "bg-emerald-500/10 text-emerald-400"}
        />
      </div>

      <Card className="border-border shadow-none gap-0 py-0">
        <CardHeader className="px-5 pt-4 pb-3 border-b border-border/30 gap-0">
          <CardTitle className="text-[13px] font-590 leading-none">Error Rate (last 24h) — SLA threshold 10%</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <LineChart
            xAxisData={data.series.map((p) => p.time)}
            seriesData={[
              { name: "Error Rate %", data: data.series.map((p) => +p.error_rate.toFixed(2)), color: "#ef4444", smooth: true, areaColor: ["rgba(239,68,68,0.10)", "rgba(239,68,68,0.01)"] },
              { name: "SLA Threshold", data: data.series.map((p) => p.threshold), color: "#f59e0b", smooth: false },
            ]}
            height="260px"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorRateChart;
